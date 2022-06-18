import React, { useState, useEffect } from 'react'
import { CgArrowsExchangeV } from 'react-icons/cg'
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'
import QRCode from 'qrcode'
import {useAccount,useNetwork} from 'wagmi'
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
  container: `flex flex-wrap before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('../assets/4.jpg')] before:bg-cover before:bg-center before:bg-fixed before:opacity-100 before:blur`,
  contentWrapper: `w-[95%] lg:w-full m-4 relative justify-center flex flex-wrap items-center block flex-grow lg:flex lg:items-center lg:w-auto`,
  wrapper: `w-full relative mt-4 border border-[#151b22] rounded-xl bg-[#ffffff]] overflow-hidden justify-center `,
  titleLeft: `flex-1 flex items-center text-xl font-bold justify-center text-black cursor-pointer`,
  titlle: `bg-[#ffffff] px-6 py-4 flex iems-center`,
  titleIcon: `text-3xl`,
  titleRight: `text-xl text-black`,
  copyContainer: `w-full justify-center items-center lg:w-1/2`, //small screen
  center: ` relative justify-center flex-wrap items-center `,
  searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
  searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
  searchBarVerify: `flex flex-1 w-max-[520px] items-center rounded-[0.8rem]`,

  title: `relative text-[##6b03fc] text-[46px] font-semibold`,
  button: `font-bold w-full mt-2 bg-[#eb77f2] text-white text-lg rounded shadow-lg hover:bg-[#e134eb] cursor-pointer`,
  description: `text-[#8a939b] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
  spinner: `w-full flex justify-center text-white mt-20 p-100 object-center`,
  nftButton: `font-bold w-full mt-4 bg-pink-500 text-white text-lg rounded p-4 shadow-lg hover:bg-[#19a857] cursor-pointer`,
  dropDown: `font-bold w-full mt-4 bg-[#2181e2] text-white text-lg rounded p-4 shadow-lg cursor-pointer`,
  editItem: `text-[#000000] hover:text-[#81817c] cursor-pointer`,
  details: `w-full p-3`,
  responsive: `flex flex-wrap w-full justify-center items-center lg:flex lg:justify-between lg:text-[#e4e8eb] lg:drop-shadow-xl`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`, //big screen
  infoLeft: `flex-0.2 flex-wrap`,
  infoRight: `flex-0.4 text-right ml-5`,
}

const MyProfile = () => {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | undefined>()
  const [src, setSrc] = useState('')
  const { data } = useAccount()
  const {activeChain} = useNetwork()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loadingState, setLoadingState] = useState(false)
 
  const [otp, setOtp] = useState(false)
  const [formInput, updateFormInput] = useState({ otp: '' })
  const [details, setDetails] = useState<WalletCardDetail[]>([])
  const [toggle, setToggle] = useState(true)
  const [toggleRight, setToggleRight] = useState(true)
  const [toggleWallet, setToggleWallet] = useState(true)
  const [myAddedWallets, setMyAddedWallets] = useState<WalletCardDetail[]>([])

  useEffect(() => {
    
    (window as any).ethereum
      .request({ method: 'eth_requestAccounts' }) // get the connected wallet address
      .then((result: string[]) => {
        QRCode.toDataURL(result[0]).then((data) => {
          console.log("data", QRCode.toDataURL(result[0]))
          setSrc(data) //Generate QR code for the connected wallet address
        })
      })
    fetchWalletDetails()
  }, [data?.address, activeChain?.id])

  
  async function fetchWalletDetails() {
    setLoadingState(true)
    await (window as any).ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider((window as any).ethereum) //create provider
    
    const signer = provider.getSigner() // get signer
    const network = await provider.getNetwork()
    
    const phoneLinkContract = new ethers.Contract(
      getConfigByChain(network.chainId)[0].phoneLinkAddress,
      PhoneLink.abi,
      signer
    )
    
    const datas: any[] = await phoneLinkContract.getWalletDetails(data?.address)
    console.log("data",datas)
    const myWallet = await phoneLinkContract.myWallets()
    console.log("mywallet",myWallet)
    const items = datas.filter(i => i.typeOfIdentifier).map((i) => {
      return {
        name: i.name,
        identifier: i.identifier,
        typeOfIdentifier: i.typeOfIdentifier,
        connectedWalletAddress: i.connectedWalletAddress,
        isPrimaryWallet: i.isPrimaryWallet == true,// ? 'Primary Wallet' : 'Secondary Wallet',
      } as WalletCardDetail
    })
    const myWalletItems = myWallet.filter(i => i.typeOfIdentifier).map((i) => {
      return {
        name: i.name,
        identifier: i.identifier,
        typeOfIdentifier: i.typeOfIdentifier,
        connectedWalletAddress: i.connectedWalletAddress,
        isPrimaryWallet: i.isPrimaryWallet == true,// ? 'Primary Wallet' : 'Secondary Wallet',
      } as WalletCardDetail
    })
    console.log("items/details", items)
    console.log("data", data)
    if (!datas?.length) {
      Router.push({ pathname: '/register' })
    } else {
      setDetails(items)
      setMyAddedWallets(myWalletItems)
    }
    setLoadingState(false)
  }

  
  return (

    <div className={style.pageWrapper}>
      <div className={style.container}>
        <div className={style.contentWrapper}>
          {loadingState == true ? (
            <BusyLoader loaderType={LoaderType.Ring} color={'#ffffff'} size={50}>
              <b>Fetching data from blockchain...</b>
            </BusyLoader>
          ) : (
            <>

              <div className={style.details}>
                <div className={style.responsive}>
                  <div className={style.infoLeft}>
                    <div className={style.wrapper}>
                      <div className={style.titlle}
                      /*onClick={() => setToggle(!toggle)}*/  /****Comment out to toggle  */
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
                        <div className="flex flex-wrap items-center justify-center w-full h-full overflow-hidden `,">
                          <a href={src} download><img src={src} height={400} width={400} /></a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={style.copyContainer}>
                    <div className={style.infoLeft}>
                      <div className={style.wrapper}>
                        <div className={style.titlle} onClick={() => setToggleRight(!toggleRight)}>
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
                          <div className={`flex flex-wrap justify-center`}>
                            {details.map((detail, id) => (
                              <WalletCard key={id} detail={detail} type="details" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={style.infoLeft}>
                      <div className={style.wrapper}>
                        <div className={style.titlle} onClick={() => setToggleWallet(!toggleWallet)}>
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
                          <div className={`flex flex-wrap justify-center`}>
                            {myAddedWallets.map((detail, id) => (
                              <WalletCard key={id} detail={detail} type="wallets" />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </>

          )}
        </div>
      </div></div>

  )
}

export default MyProfile
