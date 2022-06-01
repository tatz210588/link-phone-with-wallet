import { useEffect, useState } from 'react'
import Lottie, { LottieProps } from 'react-lottie'
import { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { ThirdwebProvider } from '@3rdweb/react'
import { ThirdwebWeb3ProviderProps } from '@3rdweb/hooks'

import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import * as globeLoaderData from '../assets/globe.json'
import * as successLoaderData from '../assets/success.json'

const supportedChainIds: ThirdwebWeb3ProviderProps['supportedChainIds'] = [
  //1,
  //4,
  //137,
  // 80001,
  //43114,
  242,
]

const connectors: ThirdwebWeb3ProviderProps['connectors'] = {
  injected: {},
  magic: {
    apiKey: 'pk_...', // Your magic api key
    chainId: 242, // The chain ID you want to allow on magic
  },
  walletconnect: {},
  walletlink: {
    appName: 'thirdweb - demo',
    url: 'https://thirdweb.com',
    darkMode: false,
  },
}

const loaderAnimation = (loading: boolean): LottieProps['options'] => ({
  loop: loading,
  autoplay: true,
  animationData: loading ? globeLoaderData : successLoaderData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
})

const loaderSize = 320

const LinkCryptoWalletApp = ({ Component, pageProps }: AppProps) => {
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    let loadTimer = setTimeout(() => {
      setLoading(false)
    }, 2500)

    return () => clearTimeout(loadTimer)
  }, [])

  useEffect(() => {
    let completeTimer = null
    if (!loading) {
      completeTimer = setTimeout(() => {
        setCompleted(true)
      }, 1000)
    }

    return () => clearTimeout(completeTimer)
  }, [loading])

  return (
    <>
      {!completed ? (
        <div className="loading-container container">
          <Lottie
            options={loaderAnimation(loading)}
            height={loaderSize}
            width={loaderSize}
          />
        </div>
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
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default LinkCryptoWalletApp
