import React, { useState, useEffect } from 'react'
import QrReader from 'react-qr-scanner'
import { TokenInfo } from '../assets/tokenConfig'
import { useWeb3 } from '@3rdweb/hooks'
// import { rounded } from '../components/utils'
// import { ethers } from 'ethers'
// import BigNumber from 'bignumber.js'
import toast from 'react-hot-toast'
// import PhoneLink from '../artifacts/contracts/phoneLink.sol/phoneLink.json'
// import { getConfigByChain } from '../config'
import Container from '../components/Container'
import BusyLoader, { LoaderType } from '../components/BusyLoader'
import PaymentHelper from '../components/PaymentHelper'

const style = {
  center: ` h-screen relative justify-center flex-wrap items-center `,
  searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
  searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
  copyContainer: `w-1/2`,
  title: `relative text-white text-[46px] font-semibold`,
  description: `text-[#fff] container-[400px] text-md mb-[2.5rem]`,
  spinner: `w-full h-screen flex justify-center text-white mt-20 p-100 object-center`,
  nftButton: `font-bold w-full mt-4 bg-pink-500 text-white text-lg rounded p-4 shadow-lg hover:bg-[#19a857] cursor-pointer`,
  dropDown: `font-bold w-full mt-4 bg-[#2181e2] text-white text-lg rounded p-4 shadow-lg cursor-pointer`,
}

const defaults = {
  balanceToken: '0',
  walletName: 'Fetching data. Please Wait...',
}

const qrPay = () => {
  const [scanResultWebCam, setScanResultWebCam] = useState('')
  const [formInput, updateFormInput] = useState({ amount: 0 })
  const { chainId } = useWeb3()
  const [paymentHelper, setPaymentHelper] = useState(PaymentHelper())
  const [balanceToken, setBalanceToken] = useState(defaults.balanceToken)
  // const [selectedToken, setSelectedToken] = useState<TokenInfo | undefined>()
  const [loadingState, setLoadingState] = useState(false)
  // const [loadingBalanceState, setLoadingBalanceState] = useState(false)
  const [defaultAccount, setDefaultAccount] = useState('')
  const [walletName, setWalletName] = useState(defaults.walletName)
  const [availableTokens, setAvailableTokens] = useState<TokenInfo[]>([])

  useEffect(() => {
    // window.ethereum
    //   .request({ method: 'eth_requestAccounts' })
    //   .then((result: string[]) => {
    //     setDefaultAccount(result[0])
    //   })
    // console.info({ defaultAccount })
    setLoadingState(true)
    paymentHelper.initialize().then((_) => setLoadingState(false))
  }, [defaultAccount])

  useEffect(() => {
    paymentHelper.connectWallet(chainId)
    setAvailableTokens(paymentHelper.data().availableTokens)
  }, [chainId])

  const handleErrorWebCam = (error: any) => {
    console.error({ error })
  }

  async function fetchDetails(address: string) {
    setLoadingState(true)
    setWalletName(
      (await paymentHelper.fetchDetails(address)) ?? defaults.walletName
    )
    // window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
    // const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
    // const signer = provider.getSigner() // get signer
    // ethers.utils.getAddress(defaultAccount) //checks if an address is valid one
    // const network = await provider.getNetwork()

    // const phoneLinkContract = new ethers.Contract(
    //   getConfigByChain(network.chainId)[0].phoneLinkAddress,
    //   PhoneLink.abi,
    //   signer
    // )
    // const data = await phoneLinkContract.getWalletDetails(address)
    // const items = await Promise.all(
    //   data.map(async (i: any) => {
    //     let item = {
    //       name: i.name,
    //       phoneNumber: i.phoneNumber,
    //       connectedWalletAddress: i.connectedWalletAddress,
    //     }
    //     return item
    //   })
    // )
    // setWalletName(items[0].name)
    setLoadingState(false)
  }

  const handleScanWebCam = (result: any) => {
    if (result) {
      fetchDetails(result.text)
      setScanResultWebCam(result.text)
    }
  }

  async function loadBalance(selectToken?: TokenInfo) {
    if (selectToken) {
      // setSelectedToken(selectToken)
      setLoadingState(true)
      setBalanceToken(
        (await paymentHelper.loadBalance(selectToken)) ?? defaults.balanceToken
      )
      // await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
      // const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider

      // if (selectToken) {
      //   if ('null' !== selectToken.address) {
      //     //if selected token address is non-native token
      //     const tokenContract = new ethers.Contract(
      //       selectToken.address,
      //       PhoneLink.abi,
      //       provider
      //     )
      //     const data = await tokenContract.balanceOf(defaultAccount)
      //     const pow = new BigNumber('10').pow(new BigNumber(selectToken.decimal))
      //     console.info('fetching balance')
      //     setBalanceToken(web3BNToFloatString(data, pow, 0, BigNumber.ROUND_DOWN))
      //   } else {
      //     //if selected token is native token
      //     const balance = await provider.getBalance(defaultAccount)
      //     const balanceInEth = ethers.utils.formatEther(balance)
      //     setBalanceToken(rounded(balanceInEth))
      //   }
      setLoadingState(false)
      // } else {
      //   toast.error('Enter Valid details please!!')
      // }
    } else {
      setBalanceToken(defaults.balanceToken)
    }
  }

  async function transfer() {
    // if (selectedToken && formInput.amount > 0) {
    //   if (Number(balanceToken) > formInput.amount) {
    setLoadingState(true)
    await paymentHelper.transfer(formInput.amount, scanResultWebCam, true)
    // await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
    // const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
    // const signer = provider.getSigner() // get signer
    // ethers.utils.getAddress(defaultAccount) //checks if an address is valid one
    // const network = await provider.getNetwork()

    // console.info({ 'selectedToken.address': selectedToken.address })
    // const tokenContract = new ethers.Contract(
    //   selectedToken.address,
    //   PhoneLink.abi,
    //   signer
    // )
    // const amount = ethers.utils.parseUnits(
    //   formInput.amount.toString(),
    //   'ether'
    // )

    // if ('null' !== selectedToken.address) {
    //   //for non-native coin
    //   const tx = await tokenContract.transfer(scanResultWebCam, amount) //transfers tokens from msg.sender to destination wallet
    //   tx.wait(1)
    // } else {
    //   //for native coin
    //   const tx = await signer.sendTransaction({
    //     to: scanResultWebCam, //destination wallet address
    //     value: amount, // amount of native token to be sent
    //   })
    //   tx.wait(1)
    // }
    // toast.success('Transfer Successful.')
    setLoadingState(false)
    //     await loadBalance(selectedToken)
    //     console.info({ balanceToken })
    //   } else {
    //     toast.error('You need more balance to execute this transaction.')
    //   }
    // } else {
    //   toast.error('Please fill all the details correctly')
    // }
    await loadBalance(paymentHelper.data().selectedToken)
  }

  // function web3BNToFloatString(
  //   bn: any,
  //   divideBy: BigNumber,
  //   decimals: number,
  //   roundingMode = BigNumber.ROUND_DOWN
  // ) {
  //   const converted = new BigNumber(bn.toString())
  //   const divided = converted.div(divideBy)
  //   return divided.toFixed(decimals, roundingMode)
  // }
  return (
    <Container>
      {!chainId ? (
        <BusyLoader loaderType={LoaderType.Ring} color={'#ffffff'} size={50}>
          <b>Click on the Connect Wallet button !!</b>
        </BusyLoader>
      ) : !scanResultWebCam ? (
        <QrReader
          delay={300}
          style={{ width: '100%' }}
          onError={handleErrorWebCam}
          onScan={handleScanWebCam}
        />
      ) : (
        <div className={style.copyContainer}>
          <div className={`${style.description} mt-8 p-1`}>
            Name: {walletName}
          </div>
          <div className={`${style.description} mt-2 p-1`}>
            Wallet Address: {scanResultWebCam}
          </div>
          <div className=" mt-4 grid grid-cols-3 gap-2">
            <select
              className={style.dropDown}
              onChange={async (e) => {
                const selectedValue = Number(e.target.value)
                let token: TokenInfo | undefined
                if (selectedValue) {
                  token = availableTokens[Number(selectedValue)]
                }
                await loadBalance(token)
              }}
            >
              {availableTokens.map((token: TokenInfo, index: number) => (
                <option value={index} key={token.address}>
                  {token.name}
                </option>
              ))}
            </select>

            <div className={`${style.searchBar} mt-2 p-1`}>
              <input
                className={style.searchInput}
                placeholder="Amount to transfer"
                onChange={(e) => {
                  updateFormInput({
                    ...formInput,
                    amount: Number(e.target.value),
                  })
                }}
              />
            </div>
            <div className={style.description}>
              Available Balance: {balanceToken}
            </div>
          </div>
          {loadingState === true ? (
            <BusyLoader
              loaderType={LoaderType.Beat}
              wrapperClass="white-busy-container"
              className="white-busy-container"
              color={'#ffffff'}
              size={15}
            >
              Connecting to blockchain. Please wait
            </BusyLoader>
          ) : (
            <div>
              {
                <div>
                  <button
                    onClick={() => transfer()}
                    className={style.nftButton}
                  >
                    Transfer
                  </button>
                </div>
              }
            </div>
          )}
        </div>
      )}
    </Container>
  )
}

export default qrPay
