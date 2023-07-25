"use client";

import React, { useEffect, useState } from "react";
import {
  Heading,
  VStack,
  Text,
  Flex,
  Button,
  Input,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import ChessmanABI from "../../../lib/abis/ChessmanABI.json";
import { writeContract, waitForTransaction, readContract } from "@wagmi/core";
import { CONTRACT, stringToUint8Array } from "../../../lib/utils";
import { useAccount } from "wagmi";
import rsa from 'js-crypto-rsa'

const Home: React.FC = () => {
  // const { turn } = useSelector((state: RootState) => state.chess);
  const [games, setGames] = useState<any[]>([]);
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const { address } = useAccount();

  const [gameData, setGameData] = useState<string>("");

  const [blackPlayerAddr, setBlackPlayerAddr] = useState(
    "0xF6C42302bC230BBA9c5379dDFb33ca72409E1624"
  );

  const toast = useToast();

  const createRequest = async () => {
    try {
      const { hash } = await writeContract({
        address: CONTRACT,
        abi: ChessmanABI,
        functionName: "startGameRequest",
        args: [blackPlayerAddr],
      });

      const { transactionHash } = await waitForTransaction({
        hash,
      });

      if (hash) {
        toast({
          title: "Request created.",
          description: `Transaction hash: ${transactionHash}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (e: any) {
      console.log(e);
      toast({
        title: "Request failed.",
        description: e.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const getGameForUser = async () => {
    const userGames = [];

    for (let j = 0; ; ++j) {
      try {
        console.log("Fetching for: ", { address, j });
        const g1 = await readContract({
          address: CONTRACT,
          abi: ChessmanABI,
          functionName: "userGames",
          args: [address, j],
        });

        console.log(g1);

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
        };

        userGames.push(game);
      } catch (e) {
        break;
      }
    }

    console.log(userGames);
    setGames(userGames);
  };

  function splitStringIntoChunks(input: string, chunkSize: number): string[] {
    let chunks = [];
    for (let i = 0; i < input.length; i += chunkSize) {
      chunks.push(input.slice(i, i + chunkSize));
    }
    return chunks;
  }

  const encryptString = async (str: string, publicKey: any) => {
    const toE = stringToUint8Array(str)
    const encrypted = await rsa.encrypt(toE, publicKey, 'SHA-256');
    return encrypted;
  }

  useEffect(() => {
    if (address) {
      getGameForUser();
    }
  }, [address]);

  return (
    <Flex p={10} gap={4}>
      <Flex direction={"column"} gap={4} flex={1}>
        <Input
          value={blackPlayerAddr}
          onChange={(e) => {
            setBlackPlayerAddr(e.target.value);
          }}
          placeholder="Enter black player address"
        />
        <Button onClick={createRequest}>Create Request</Button>
        <Text>My games</Text>
        <VStack>
          {games.map((game, i) => {
            return (
              <Text
                cursor={"pointer"}
                color={selectedGameIndex === i ? "blue" : "black"}
                onClick={() => {
                  setSelectedGameIndex(i);
                }}
                key={game.gameId}
              >
                Game {game.gameId} - {game.whitePlayer} vs {game.blackPlayer}
              </Text>
            );
          })}
        </VStack>
      </Flex>
      <Flex display={games[selectedGameIndex] === undefined ? 'none' : 'flex'} direction={"column"} gap={4} flex={1}>
        <Heading as="h1">Game {games[selectedGameIndex]?.gameId}</Heading>
        <Text fontSize={"lg"}>
          White: {games[selectedGameIndex]?.whitePlayer}
        </Text>
        <Text fontSize={"lg"}>
          White player hash: {games[selectedGameIndex]?.dataWhite === "" ? "Not submitted!" : "Submitted!"}
        </Text>
        <Text fontSize={"lg"}>
          Black: {games[selectedGameIndex]?.blackPlayer}
        </Text>
        <Text fontSize={"lg"}>
          Black player hash: {games[selectedGameIndex]?.dataBlack === "" ? "Not submitted!" : "Submitted!"}
        </Text>
        <Textarea
          value={gameData}
          onChange={(e) => {
            setGameData(e.target.value);
          }}
          placeholder="Enter game data"
        />
        <Button onClick={async () => {
          if (!games[selectedGameIndex]) return

          const isWhite = games[selectedGameIndex].whitePlayer === address;

          // Do the encryption
          const pubKeyStr = games[selectedGameIndex].pubKey;
          const pubKey = JSON.parse(pubKeyStr);

          const encryptedStringPromises = Promise.all(splitStringIntoChunks(gameData, 25).map((chunk) => {
            const data = encryptString(chunk, pubKey);
            return data;
          }));

          const encryptedString = (await encryptedStringPromises).join('*****');

          console.log(encryptedString)

          const { hash } = await writeContract({
            address: CONTRACT,
            abi: ChessmanABI,
            functionName: isWhite ? 'submitGameWhite' : 'submitGameBlack',
            args: [games[selectedGameIndex].gameId, encryptedString],
          });

          const { transactionHash } = await waitForTransaction({ hash });

          toast({
            title: "Request approved.",
            description: `Transaction hash: ${transactionHash}`,
            status: "success",
            duration: 9000,
            isClosable: true,
          })
        }}>Update</Button>
      </Flex>
    </Flex>
  );
};

export default Home;
