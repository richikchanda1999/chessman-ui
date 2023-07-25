"use client";

import { Box, Button, CircularProgress, Flex, HStack, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { readContract, waitForTransaction, writeContract } from "@wagmi/core";
import { CONTRACT, uint8ArrayToString } from "../../../lib/utils";
import ChessmanABI from "../../../lib/abis/ChessmanABI.json";
import rsa from 'js-crypto-rsa'

function Leaderboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ratingChange, setRatingChange] = useState(0);

    const toast = useToast()
    const [selectedUserIndex, setSelectedUserIndex] = useState(0);

    const fetchAllUsers = async () => {
        const users = [];
        for (let i = 0; ; ++i) {
            try {
                const userAddr = await readContract({
                    address: CONTRACT,
                    abi: ChessmanABI,
                    functionName: "userArr",
                    args: [i],
                });

                console.log(1, userAddr);

                const user = await readContract({
                    address: CONTRACT,
                    abi: ChessmanABI,
                    functionName: "users",
                    args: [userAddr],
                });

                console.log(2, user);

                const addr = (user as any[])[0];
                const rating = (user as any[])[1];

                const userGames = [];

                for (let j = 0; ; ++j) {
                    try {
                        console.log("Fetching for: ", { addr, j });
                        const g1 = await readContract({
                            address: CONTRACT,
                            abi: ChessmanABI,
                            functionName: "userGames",
                            args: [addr, j],
                        });

                        console.log(g1)

                        const g = await readContract({
                            address: CONTRACT,
                            abi: ChessmanABI,
                            functionName: "games",
                            args: [(g1 as any[])[0]],
                        });

                        const game = {
                            gameId: parseInt((g as any[])[0]),
                            whitePlayer: (g as any[])[1],
                            blackPlayer: (g as any[])[2],
                            pubKey: (g as any[])[3],
                            dataWhite: (g as any[])[4],
                            dataBlack: (g as any[])[5],
                            gameResult: (g as any[])[6],
                            isAbandonedByWhite: (g as any[])[7],
                            isAbandonedByBlack: (g as any[])[8],
                            genPubKey: "",
                            genPrivKey: "",
                            result: "",
                        }

                        userGames.push(game);
                    } catch (e) {
                        break;
                    }
                }

                console.log(3, userGames);

                users.push({
                    address: addr,
                    rating,
                    games: userGames,
                });
            } catch (e) {
                break;
            }
        }

        setUsers(users);
    };

    const generateKeyPair = async () => {
        const keyPair = await rsa.generateKey(1024);

        const pubKey = JSON.stringify(keyPair.publicKey);
        const privKey = JSON.stringify(keyPair.privateKey);

        return { pubKey, privKey };
    };

    useEffect(() => {
        if (isLoading) return;
        setIsLoading(true);
        fetchAllUsers().then(() => {
            setIsLoading(false);
        });
    }, []);

    const decryptString = async (arr: Uint8Array, privateKey: any) => {
        const decrypted = await rsa.decrypt(arr, privateKey, 'SHA-256');
        return uint8ArrayToString(decrypted);
    }

    const getDecryptedString = async (data: string, privKey: any) => {
        const decryptedStringPromises = Promise.all(data.split('*****').map((chunk: string) => {
            const d = Uint8Array.from(chunk.split(',').map((c) => parseInt(c)));
            const data = decryptString(d, privKey);
            return data;
        }));

        const decryptedString = (await decryptedStringPromises).join('');
        return decryptedString;
    }

    if (isLoading) return <CircularProgress isIndeterminate color="green.300" />;

    return (
        <Flex justify={'space-between'} px={24}>
            <Flex p={6} direction={"column"}>
                <Box overflowX="auto">
                    <Table variant="simple" width="full">
                        <Thead>
                            <Tr>
                                <Th>Address</Th>
                                <Th>Rating</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {users.map((user, i) => (
                                <Tr key={i}>
                                    <Td><Text
                                        cursor={"pointer"}
                                        color={selectedUserIndex === i ? "blue" : "black"}
                                        onClick={() => {
                                            setSelectedUserIndex(i);
                                        }}
                                    >
                                        {user.address}
                                    </Text></Td>
                                    <Td><Text>{parseInt(user.rating)}</Text></Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Flex>
            <Flex direction={"column"}>
                <Box p={6}>
                    <VStack spacing={6}>
                        {users[selectedUserIndex]?.games.map((game: any, i: number) => (
                            <Box key={i} borderWidth="1px" borderRadius="lg" p={4} shadow="md">
                                <VStack align="start" spacing={4}>
                                    <Text fontSize="xl" fontWeight="bold">Game ID: {game.gameId}</Text>
                                    <Text>Black Player: {game.blackPlayer}</Text>
                                    <Text>White Player: {game.whitePlayer}</Text>

                                    {(game.dataWhite === '' && game.dataBlack === '') && <Flex>
                                        <Button isDisabled={game.genPubKey === "" || game.genPrivKey === ""} onClick={async () => {
                                            const { hash } = await writeContract({
                                                address: CONTRACT,
                                                abi: ChessmanABI,
                                                functionName: "approveGameRequest",
                                                args: [game.gameId, game.genPubKey],
                                            });

                                            const { transactionHash } = await waitForTransaction({ hash });

                                            toast({
                                                title: "Request approved.",
                                                description: `Transaction hash: ${transactionHash}`,
                                                status: "success",
                                                duration: 9000,
                                                isClosable: true,
                                            })
                                        }}>Accept</Button>
                                        <Button isDisabled={game.genPubKey !== "" && game.genPrivKey !== ""} onClick={async () => {
                                            const { pubKey, privKey } = await generateKeyPair();

                                            const newUsers = [...users];
                                            newUsers[selectedUserIndex].games[i].genPubKey = pubKey;
                                            newUsers[selectedUserIndex].games[i].genPrivKey = privKey;
                                            setUsers(newUsers);

                                            localStorage.setItem(`${game.gameId}-pubKey`, pubKey);
                                            localStorage.setItem(`${game.gameId}-privKey`, privKey);
                                        }}>Generate key pair</Button>
                                    </Flex>}

                                    {(game.dataWhite !== '' && game.dataBlack !== '') && <Flex gap={4}>
                                        <Button onClick={async () => {
                                            const privKey = JSON.parse(localStorage.getItem(`${game.gameId}-privKey`)!);

                                            const decryptedWhite = await getDecryptedString(game.dataWhite, privKey)
                                            const decryptedBlack = await getDecryptedString(game.dataBlack, privKey)
                                            console.log('White', decryptedWhite);
                                            console.log('Black', decryptedBlack);

                                            const pgnView = await import('@mliebelt/pgn-viewer').then((m) => m.pgnView);
                                            pgnView(`board-${game.gameId}`, { pgn: decryptedWhite, locale: 'fr', width: '200px' })

                                            console.log()
                                        }}>View Result</Button>

                                        {game.gameResult === "" && <Button onClick={async () => {
                                            const { hash } = await writeContract({
                                                address: CONTRACT,
                                                abi: ChessmanABI,
                                                functionName: "finishGame",
                                                args: [game.gameId, game.result, game.result === 'white' ? ratingChange : game.result === 'black' ? -ratingChange : 0, game.result === 'white' ? -ratingChange : game.result === 'black' ? ratingChange : 0],
                                            })

                                            const { transactionHash } = await waitForTransaction({ hash });

                                            toast({
                                                title: "Game finished.",
                                                description: `Transaction hash: ${transactionHash}`,
                                                status: "success",
                                                duration: 9000,
                                                isClosable: true,
                                            })

                                        }}>Finish game</Button>}
                                    </Flex>}
                                    {
                                        game.gameResult !== "" && <Text>Result: {game.gameResult}</Text>
                                    }
                                    {game.gameResult === "" && <Select onChange={(e) => {
                                        const newUsers = [...users];
                                        newUsers[selectedUserIndex].games[selectedUserIndex].result = e.target.value;
                                        setUsers(newUsers);
                                    }}>
                                        {['white', 'black', 'draw'].map((game: string, i: number) => {
                                            return <option key={i} value={game} selected={users[selectedUserIndex]?.games[selectedUserIndex].result === game}>{game}</option>
                                        })}
                                    </Select>}
                                    {
                                        game.gameResult === "" && <Input placeholder="Enter rating change" type="number" value={ratingChange} onChange={(e) => {
                                            setRatingChange(parseInt(e.target.value));
                                        }} />
                                    }
                                    <div id={`board-${game.gameId}`} style={{ width: '400px' }} />
                                </VStack>
                            </Box>
                        ))}
                    </VStack>
                </Box>
                {/* {users[selectedUserIndex]?.games.map((game: any, i: number) => {
                    return <Flex key={game.gameId} direction={'column'}>
                        <Text>Game {game.gameId}</Text>
                        <Text>{game.whitePlayer}</Text>
                        <Text>{game.blackPlayer}</Text>
                        

                        
                    </Flex>
                })} */}
            </Flex>
        </Flex>
    );
}

export default Leaderboard;
