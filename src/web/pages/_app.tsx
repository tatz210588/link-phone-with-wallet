import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import Lottie from 'react-lottie'
import * as globeLoaderData from '../assets/globe.json'
import * as successLoaderData from '../assets/success.json'
import { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import {WagmiConfig,configureChains,chain,createClient} from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import {getDefaultWallets,RainbowKitProvider,connectorsForWallets,wallet,Chain, darkTheme, lightTheme} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

const globeLoader = {
  loop: true,
  autoplay: true,
  animationData: globeLoaderData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

const successLoader = {
  loop: true,
  autoplay: true,
  animationData: successLoaderData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

const Kardiachain_testNet: Chain = {
  id: 242,
  name: 'KAI TestNet',
  network: 'Kardiachain-testnet',
  iconUrl: 'https://ipfs.infura.io/ipfs/QmV91sx1aWr2RhzF3LRq5M1qoGvYURaqTtsKjF3kiE88Xw',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'KAI',
    symbol: 'KAI',
  },
  rpcUrls: {
    default: 'https://dev.kardiachain.io/',
  },
  blockExplorers: {
    default: { name: 'Kai-Test-Scanner', url: 'https://explorer.kardiachain.io/' }
  },
  testnet: true,
};

const Kardiachain_mainnet: Chain = {
  id: 24,
  name: 'KARDIACHAIN MAINNET',
  network: 'Kardiachain-mainnet',
  iconUrl: 'https://ipfs.infura.io/ipfs/QmV91sx1aWr2RhzF3LRq5M1qoGvYURaqTtsKjF3kiE88Xw',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'KAI',
    symbol: 'KAI',
  },
  rpcUrls: {
    default: 'https://rpc.kardiachain.io',
  },
  blockExplorers: {
    default: { name: 'Kai-Scanner', url: 'https://explorer.kardiachain.io/' }
  },
  testnet: false,
};


const {chains, provider} = configureChains(
  [chain.polygonMumbai,chain.rinkeby,Kardiachain_mainnet,Kardiachain_testNet],
  [jsonRpcProvider({rpc:chain=>({http:chain.rpcUrls.default})})]
)

// const {connectors} = getDefaultWallets({
//   appName: "My App",
//   chains
// })

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      wallet.rainbow({ chains }),
      wallet.walletConnect({ chains }),
      wallet.metaMask({chains}),
      wallet.trust({chains}),
      wallet.argent({chains}),
      wallet.coinbase({appName:"My App",chains}),
      wallet.brave({chains}),
      wallet.steak({chains})
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect:true,
  connectors,
  provider
})

const linkPhoneWithWallet = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  
  const [loaderSize, setLoaderSize] = useState(320)
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(true)
      setTimeout(() => {
        setCompleted(true)
      }, 1000)
    }, 4000)
  }, [])

  return (
    <>
      {!completed ? (
        <div className="loading-container container">
          {!loading ? (
            <Lottie
              options={globeLoader}
              height={loaderSize}
              width={loaderSize}
            />
          ) : (
            <Lottie
              options={successLoader}
              height={loaderSize}
              width={loaderSize}
            />
          )}
        </div>
      ) : (
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains} theme={lightTheme()} coolMode showRecentTransactions={true}>
            <Header />
            <Toaster position="top-center" reverseOrder={false} />
            <Component {...pageProps} />
            <Footer />
          </RainbowKitProvider>
        </WagmiConfig>
      )}
    </>
  )
}

export default linkPhoneWithWallet
