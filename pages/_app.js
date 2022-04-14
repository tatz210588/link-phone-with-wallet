import '../styles/globals.css'
import Header from '../components/Header'
import { ThirdwebProvider } from "@3rdweb/react";
import Footer from '../components/Footer'

function linkPhoneWithWallet({ Component, pageProps }) {
  const supportedChainIds = [1, 4, 137, 80001, 43114];
  const connectors = {
    injected: {},
    magic: {
      apiKey: "pk_...", // Your magic api key
      chainId: 1, // The chain ID you want to allow on magic
    },
    walletconnect: {},
    walletlink: {
      appName: "thirdweb - demo",
      url: "https://thirdweb.com",
      darkMode: false,
    },
  };
  return (
    <ThirdwebProvider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >

      <div>
        <Header />

        <Component {...pageProps} />
        <Footer />
      </div>
    </ThirdwebProvider>
  )
}

export default linkPhoneWithWallet
