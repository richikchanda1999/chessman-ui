'use client';

import React, { useState } from 'react';
import { Heading, VStack, Text, Flex, Button, Input, useToast } from "@chakra-ui/react";
import Board from 'src/components/Board';
import { useSelector } from 'react-redux';
import { RootState } from '../../../lib/redux/store';
import ChessmanABI from "../../../lib/abis/ChessmanABI.json";
import { writeContract, waitForTransaction } from '@wagmi/core';

const Home: React.FC = () => {
  const { turn } = useSelector((state: RootState) => state.chess);

  const [blackPlayerAddr, setBlackPlayerAddr] = useState('');

  const toast = useToast()

  const createRequest = async () => {
    try {
      const { hash } = await writeContract({
        address: '0xBd0584223ABa09245084C9981C5eb54c9FC14D5b',
        abi: ChessmanABI,
        functionName: 'startGameRequest',
        args: [blackPlayerAddr],
      })

      const { transactionHash } = await waitForTransaction({
        hash,
      })

      if (hash) {
        toast({
          title: "Request created.",
          description: `Transaction hash: ${transactionHash}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      }
    } catch (e: any) {
      console.log(e)
      toast({
        title: "Request failed.",
        description: e.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <Flex py={10}>
      <Flex direction={'column'} gap={4}>
        <Input value={blackPlayerAddr} onChange={(e) => {
          setBlackPlayerAddr(e.target.value);
        }} placeholder="Enter black player address" />
        <Button onClick={createRequest}>Create Request</Button>
        <Text>My games</Text>
        <VStack>
          <Text>Game 1</Text>
          <Text>Game 2</Text>
          <Text>Game 3</Text>
        </VStack>
      </Flex>
      <VStack spacing={8}>
        <Heading as="h1">Chess Game</Heading>
        <Text fontSize="xl">
          {turn === 'w' ? "White's Turn" : "Black's Turn"}
        </Text>
        <Board />
      </VStack>
    </Flex>
  );
};

export default Home;
