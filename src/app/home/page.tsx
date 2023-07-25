'use client';

import React from 'react';
import { Container, Heading, VStack, Text } from "@chakra-ui/react";
import Board from 'src/components/Board';
import { useSelector } from 'react-redux';
import { RootState } from '../../../lib/redux/store';

const Home: React.FC = () => {
  const {turn} = useSelector((state: RootState) => state.chess);

  return (
    <Container maxW="container.md" centerContent py={10}>
      <VStack spacing={8}>
        <Heading as="h1">Chess Game</Heading>
        <Text fontSize="xl">
          {turn === 'w' ? "White's Turn" : "Black's Turn"}
        </Text>
        <Board />
      </VStack>
    </Container>
  );
};

export default Home;
