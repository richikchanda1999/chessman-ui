'use client';

import React from "react";
import { Box, Flex, Link, Spacer, Text } from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons';
import { useAccount } from "wagmi";

const NavBar: React.FC = () => {

  const { isConnected } = useAccount()

  return (
    <Box bg="blue.500" px={4} py={2}>
      <Flex alignItems="center">
        <HamburgerIcon boxSize={6} />
        <Text ml={4} fontSize="lg" fontWeight="bold" color="white">
          Chessman
        </Text>
        <Spacer />
        <Link color="white" mr={4} href={isConnected ? '/home' : '/'}>
          Home
        </Link>
      </Flex>
    </Box>
  );
};

export default NavBar;
