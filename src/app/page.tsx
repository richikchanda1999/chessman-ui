'use client';

import { useAccount, useConnect } from 'wagmi';
import styles from './page.module.css'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  const router = useRouter()

  useEffect(() => {
    if(isConnected) router.push('/home')
  }, [isConnected, router])

  return (
    <main className={styles.main}>
      {!isConnected && <button onClick={() => {
        connect({connector: connectors[0]})
      }}>Connect</button>}
    </main>
  )
}
