import '../styles/globals.css'
import Header from '../components/Header'
import { ThirdwebProvider } from '@3rdweb/react'
import Footer from '../components/Footer'
import { useEffect, useState } from 'react'
import Lottie from 'react-lottie'
<<<<<<< HEAD:pages/_app.js
import * as location from '../assets/globe.json'
import * as success from '../assets/success.json'

=======
import * as globeLoaderData from '../assets/globe.json'
import * as successLoaderData from '../assets/success.json'
import { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
>>>>>>> e1026de27682aebfc471ca3a62eb6da0e327cef8:pages/_app.tsx

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

const linkPhoneWithWallet = ({ Component, pageProps }) => {
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const supportedChainIds = [1, 4, 137, 80001, 43114, 24, 242]
  const [loaderSize, setLoaderSize] = useState(320)
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

export default linkPhoneWithWallet
