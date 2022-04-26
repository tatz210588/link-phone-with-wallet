import '../styles/globals.css'
import Header from '../components/Header'
import { ThirdwebProvider } from '@3rdweb/react'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import Lottie from 'react-lottie'
import * as location from '../assets/globe.json'
import * as success from '../assets/success.json'
import { AppProps } from 'next/app'

const defaultOptions1 = {
  loop: true,
  autoplay: true,
  animationData: location,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

const defaultOptions2 = {
  loop: true,
  autoplay: true,
  animationData: success,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

const linkPhoneWithWallet = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const supportedChainIds = [1, 4, 137, 80001, 43114]
  const connectors = {
    injected: {},
    magic: {
      apiKey: 'pk_...', // Your magic api key
      chainId: 1, // The chain ID you want to allow on magic
    },
    walletconnect: {},
    walletlink: {
      appName: 'thirdweb - demo',
      url: 'https://thirdweb.com',
      darkMode: false,
    },
  }
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
        <>
          {!loading ? (
            <>
              <Lottie options={defaultOptions1} height={200} width={200} />
            </>
          ) : (
            <Lottie options={defaultOptions2} height={200} width={200} />
          )}
        </>
      ) : (
        <ThirdwebProvider
          connectors={connectors}
          supportedChainIds={supportedChainIds}
        >
          <Header />
          <Component {...pageProps} />
          <Footer />
        </ThirdwebProvider>
      )}
    </>
  )
}

export default linkPhoneWithWallet
