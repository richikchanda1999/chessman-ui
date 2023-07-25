// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, Flex } from '@chakra-ui/react'
import NavBar from 'src/components/NavBar'

export function UIProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <Flex direction={'column'}>
          <NavBar />
          {children}
        </Flex>
      </ChakraProvider>
    </CacheProvider>
  )
}