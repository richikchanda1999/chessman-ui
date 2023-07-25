'use client';

import React, { useEffect, useState } from 'react';
import { Container, Heading, VStack, Text } from "@chakra-ui/react";
import Board from 'src/components/Board';

const Home: React.FC = () => {
  const [currentPlayer, setCurrentPlayer] = useState<'w' | 'b'>('w');

    useEffect(() => {
        console.log(currentPlayer)
    }, [currentPlayer])

  return (
    <Container maxW="container.md" centerContent py={10}>
      <VStack spacing={8}>
        <Heading as="h1">Chess Game</Heading>
        <Text fontSize="xl">
          {currentPlayer === 'w' ? "White's Turn" : "Black's Turn"}
        </Text>
        <Board currentPlayer={currentPlayer} onPlayerChange={setCurrentPlayer} />
      </VStack>
    </Container>
  );
};

export default Home;
