'use client'

import { polygon, polygonMumbai } from 'wagmi/chains'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { infuraProvider } from "wagmi/providers/infura"
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { InjectedConnector } from 'wagmi/connectors/injected'

const { chains, publicClient } = configureChains([polygon, polygonMumbai], [infuraProvider({ apiKey: process.env.INFURA_API_KEY! })])

const config = createConfig({
    autoConnect: true,
    publicClient: publicClient,
    connectors: [
        new MetaMaskConnector({ chains, options: { shimDisconnect: true } }),
        new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    ],
})

export function WalletProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <WagmiConfig config={config}>
            {children}
        </WagmiConfig>
    )
}