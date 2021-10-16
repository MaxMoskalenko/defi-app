import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Web3 DeFi App</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
