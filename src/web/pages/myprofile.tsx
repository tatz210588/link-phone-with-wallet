import React, { useState, useEffect } from 'react'
import { CgArrowsExchangeV } from 'react-icons/cg'
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'
import QRCode from 'qrcode'
import { useWeb3 } from '@3rdweb/hooks'
import { getConfigByChain } from '../config'
import { ethers } from 'ethers'
import PhoneLink from '../artifacts/contracts/phoneLink.sol/phoneLink.json'
import 'react-phone-number-input/style.css'
import { FirebaseApp } from 'firebase/app'
import { ellipseAddress } from '../components/utils'
import WalletCard, { WalletCardDetail } from '../components/WalletCard'
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'
import getFirebaseApp from '../components/firebase'
import toast from 'react-hot-toast'
import Router from 'next/router'
import Container from '../components/Container'
import BusyLoader, { LoaderType } from '../components/BusyLoader'
import IdInput, { IdType } from '../components/IdInput'

const style = {
  pageWrapper: `relative`,
  container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('../assets/4.jpg')] before:bg-cover before:bg-center before:bg-fixed before:opacity-100 before:blur`,
  contentWrapper: `flex relative flex-wrap items-center justify-center`,
  wrapper: `w-full mt-4 border border-[#151b22] rounded-xl bg-[#ffffff]] overflow-hidden justify-center `,
  titleLeft: `flex-1 flex items-center text-xl font-bold justify-center text-black cursor-pointer`,
  titlle: `bg-[#ffffff] px-6 py-4 flex iems-center`,
  titleIcon: `text-3xl`,
  titleRight: `text-xl text-black`,

  center: ` h-screen relative justify-center flex-wrap items-center `,
  searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
  searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
  searchBarVerify: `flex flex-1 w-max-[520px] items-center rounded-[0.8rem]`,
  copyContainer: `w-1/2 mt-8`,
  title: `relative text-[##6b03fc] text-[46px] font-semibold`,
  button: `font-bold w-full mt-2 bg-[#eb77f2] text-white text-lg rounded shadow-lg hover:bg-[#e134eb] cursor-pointer`,
  description: `text-[#8a939b] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
  spinner: `w-full h-screen flex justify-center text-white mt-20 p-100 object-center`,
  nftButton: `font-bold w-full mt-4 bg-pink-500 text-white text-lg rounded p-4 shadow-lg hover:bg-[#19a857] cursor-pointer`,
  dropDown: `font-bold w-full mt-4 bg-[#2181e2] text-white text-lg rounded p-4 shadow-lg cursor-pointer`,
  editItem: `text-[#000000] hover:text-[#81817c] cursor-pointer`,
  details: `p-3`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  infoRight: `flex-0.4 text-right ml-5`,
}

const MyProfile = () => {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | undefined>()
  const [src, setSrc] = useState('')
  const { address, chainId } = useWeb3()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loadingState, setLoadingState] = useState(false)
  const [editPhone, setEditPhone] = useState(false)
  const [signInData, setSignInData] = useState('')
  const [otp, setOtp] = useState(false)
  const [formInput, updateFormInput] = useState({ otp: '' })
  const [details, setDetails] = useState<WalletCardDetail[]>([])
  const [toggle, setToggle] = useState(true)
  const [toggleRight, setToggleRight] = useState(true)
  const [toggleWallet, setToggleWallet] = useState(true)
  const [myAddedWallets, setMyAddedWallets] = useState<WalletCardDetail[]>([])

  useEffect(() => {
    window.ethereum
      .request({ method: 'eth_requestAccounts' }) // get the connected wallet address
      .then((result: string[]) => {
        QRCode.toDataURL(result[0]).then((data) => {
          console.info({ data: QRCode.toDataURL(result[0]) })
          setSrc(data) //Generate QR code for the connected wallet address
        })
      })
    fetchWalletDetails()
  }, [address, chainId])

  useEffect(() => {
    getFirebaseApp().then((app) => setFirebaseApp(app))
  }, [firebaseApp])

  async function configureCaptcha() {
    const auth = getAuth(firebaseApp)
    window.recaptchaVerifier = new RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.info('recaptcha verifying...')
          onSignInSubmit(null).then((_) => console.info('recaptha verified...'))
        },
      },
      auth
    )
  }

  async function onSignInSubmit(e: any) {
    try {
      e?.preventDefault()
    } catch (error) {
      console.error({ error })
    }
    await configureCaptcha()
    const signInPhoneNumber = signInData
    console.info({ signInPhoneNumber })

    const appVerifier = window.recaptchaVerifier
    const auth = getAuth(firebaseApp)
    try {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = await signInWithPhoneNumber(
        auth,
        signInPhoneNumber,
        appVerifier
      )
      toast.success('OTP sent. Please enter the OTP')
      setOtp(true)
      // ...
    } catch (error) {
      // Error; SMS not sent
      // ...
      //toast.error("OTP not sent due to technical issue. Please try later.");
      console.error({ error })
    }
  }

  async function onSubmitOTP(e: any) {
    try {
      e?.preventDefault()
    } catch (error) {
      console.error({ error })
    }
    const code = formInput.otp
    console.info({ code })
    try {
      const result = await window.confirmationResult.confirm(code)
      // User signed in successfully.
      const user = result.user
      console.info({ user })
      toast.success('OTP verified. Encoding new phone number. Please Wait...')
      await savePhone()
      setOtp(false)
      // ...
    } catch (error) {
      // User couldn't sign in (bad verification code?)
      // ...
      toast.error('Wrong otp')
    }
  }

  async function fetchWalletDetails() {
    setLoadingState(true)
    await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
    const signer = provider.getSigner() // get signer
    const network = await provider.getNetwork()
    const phoneLinkContract = new ethers.Contract(
      getConfigByChain(network.chainId)[0].phoneLinkAddress,
      PhoneLink.abi,
      signer
    )
    const data: any[] = await phoneLinkContract.getWalletDetails(address)
    const myWallet: any[] = await phoneLinkContract.myWallets()
    const items = data
      .filter((i) => i.typeOfIdentifier)
      .map((i) => {
        return {
          name: i.name,
          identifier: i.identifier,
          typeOfIdentifier: i.typeOfIdentifier,
          connectedWalletAddress: i.connectedWalletAddress,
          isPrimaryWallet: i.isPrimaryWallet == true, // ? 'Primary Wallet' : 'Secondary Wallet',
        } as WalletCardDetail
      })
    const myWalletItems = myWallet
      .filter((i) => i.typeOfIdentifier)
      .map((i) => {
        return {
          name: i.name,
          identifier: i.identifier,
          typeOfIdentifier: i.typeOfIdentifier,
          connectedWalletAddress: i.connectedWalletAddress,
          isPrimaryWallet: i.isPrimaryWallet == true, // ? 'Primary Wallet' : 'Secondary Wallet',
        } as WalletCardDetail
      })
    console.info({ items })
    console.info({ data })
    if (!data?.length) {
      Router.push({ pathname: '/register' })
    } else {
      setDetails(items)
      setMyAddedWallets(myWalletItems)
    }
    setLoadingState(false)
  }

  async function savePhone() {
    if (signInData === phoneNumber) {
      toast.error('This number is already linked with your Wallet !!')
    } else {
      setLoadingState(true)

      await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
      const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
      const signer = provider.getSigner() // get signer
      const network = await provider.getNetwork() // get the network

      const phoneLinkContract = new ethers.Contract(
        getConfigByChain(network.chainId)[0].phoneLinkAddress,
        PhoneLink.abi,
        signer
      )
      const tx = await phoneLinkContract.editPhoneNumber(signInData)
      tx.wait(1)
      toast.success('Phone Number Changed !!')
      setLoadingState(false)
      setEditPhone(false)
      Router.push({ pathname: './' })
      setSignInData('')
    }
  }

  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        <div className={style.contentWrapper}>
          {loadingState == true ? (
            <BusyLoader
              loaderType={LoaderType.Ring}
              color={'#ffffff'}
              size={50}
            >
              <b>Fetching data from blockchain...</b>
            </BusyLoader>
          ) : (
            <>
              <div className={style.details}>
                <div className={style.info}>
                  <div className={style.infoLeft}>
                    <div className={style.wrapper}>
                      <div
                        className={style.titlle} /****Comment out to toggle  */
                        /*onClick={() => setToggle(!toggle)}*/
                      >
                        <div className={style.titleLeft}>
                          <span className={style.titleIcon}>
                            <CgArrowsExchangeV />
                          </span>
                          My QR CODE
                        </div>
                        {/* <div className={style.titleRight}>
                        {toggle ? <AiOutlineUp /> : <AiOutlineDown />}
                      </div> */}
                      </div>
                      {toggle && (
                        <div className="my-3 mx-1 flex h-[20rem] w-[20rem] flex-wrap justify-center overflow-hidden rounded-2xl">
                          <a href={src} download>
                            <img src={src} height={400} width={400} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-5 w-[60%] justify-center">
                    <div className={style.wrapper}>
                      <div
                        className={style.titlle}
                        onClick={() => setToggleRight(!toggleRight)}
                      >
                        <div className={style.titleLeft}>
                          <span className={style.titleIcon}>
                            <CgArrowsExchangeV />
                          </span>
                          My Linked Details
                        </div>
                        <div className={style.titleRight}>
                          {toggleRight ? <AiOutlineUp /> : <AiOutlineDown />}
                        </div>
                      </div>
                      {toggleRight && (
                        <div className="flex flex-wrap justify-center">
                          {details.map((detail, id) => (
                            <WalletCard
                              key={id}
                              detail={detail}
                              type="details"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-5 justify-center">
                    <div className={style.wrapper}>
                      <div
                        className={style.titlle}
                        onClick={() => setToggleWallet(!toggleWallet)}
                      >
                        <div className={style.titleLeft}>
                          <span className={style.titleIcon}>
                            <CgArrowsExchangeV />
                          </span>
                          My Wallets
                        </div>
                        <div className={style.titleRight}>
                          {toggleWallet ? <AiOutlineUp /> : <AiOutlineDown />}
                        </div>
                      </div>
                      {toggleWallet && (
                        <div className="flex flex-wrap justify-center">
                          {myAddedWallets.map((detail, id) => (
                            <WalletCard
                              key={id}
                              detail={detail}
                              type="wallets"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyProfile
