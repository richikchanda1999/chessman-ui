'use client';

import React from "react";
import { Box, Button, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons';
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

const NavBar: React.FC = () => {

  const { isConnected } = useAccount()

  const router = useRouter()

  return (
    <Box bg="blue.500" px={4} py={2}>
      <Flex alignItems="center">
        <HamburgerIcon boxSize={6} />
        <Text ml={4} fontSize="lg" fontWeight="bold" color="white">
          Chessman
        </Text>
        <Spacer />
        <Button color="white" mr={4} variant={'link'} onClick={() => {
          if (isConnected) router.replace('/home')
          else router.replace('/')
        }}>
          Home
        </Button>
        <Button color="white" mr={4} variant={'link'} onClick={() => {
          router.replace('/leaderboard')
        }}>
          Leaderboard
        </Button>
      </Flex>
    </Box>
  );
};

export default NavBar;
