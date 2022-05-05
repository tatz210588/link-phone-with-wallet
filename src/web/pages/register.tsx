// import { useWeb3 } from '@3rdweb/hooks'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import 'react-phone-number-input/style.css'
import PhoneLink from '../../artifacts/contracts/phoneLink.sol/phoneLink.json'
import { getConfigByChain } from '../config'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import Modal from 'react-modal'
import { maskPhone } from '../components/utils'
// import axios from 'axios'
import { FirebaseApp } from 'firebase/app'
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'
import getFirebaseApp from '../components/firebase'
import Router from 'next/router'
import Container from '../components/Container'
import BusyLoader, { LoaderType } from '../components/BusyLoader'
import IdInput from '../components/IdInput'

const style = {
  center: ` h-screen relative justify-center flex-wrap items-center `,
  searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
  searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
  searchBarVerify: `flex flex-1 w-max-[520px] items-center rounded-[0.8rem]`,
  copyContainer: `w-1/2`,
  modalListWrapper: `bg-[#303339]  w-1/3 h-1/3 mr-auto ml-auto my-28 rounded-2xl p-2 overflow-hidden  relative overflow-auto`,
  title: `relative text-white text-[32px] font-semibold`,
  description: `text-[#fff] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
  ctaContainer: `flex`,
  accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
  button: `font-bold w-full mt-2 bg-[#eb77f2] text-white text-lg rounded shadow-lg hover:bg-[#e134eb] cursor-pointer`,
  nftButton: `font-bold w-full mt-4 bg-[#eb77f2] text-white text-lg rounded p-4 shadow-lg hover:bg-[#e134eb] cursor-pointer`,
}

const idPlaceholder = 'Phone / Email'

const Home = () => {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | undefined>()
  // const { address, chainId } = useWeb3()
  const [signInData, setSignInData] = useState('')
  const [formInput, updateFormInput] = useState({ name: '', otp: '' })
  const [loadingState, setLoadingState] = useState(false)
  const [newPhNo, setNewPhNo] = useState(false)
  const [phoneNo, setPhoneNo] = useState('')
  const [otp, setOtp] = useState(false)
  // const [email, setEmail] = useState('flex')
  // const [isPhone, setIsPhone] = useState('hidden')

  // useEffect(() => {
  //   const myInput = document.getElementById('myInput') as HTMLInputElement
  //   myInput.value = ''
  //   fetchPhoneNo()
  // }, [])
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
          console.info('recaptcha verifying')
          onSignInSubmit(null).then((_) => console.info('recaptcha verified'))
        },
      },
      auth
    )
  }

  async function onSignInSubmit(e: any) {
    try {
      e?.preventDefault()
    } catch (error) {
      console.error(error)
    }
    console.info({ signInData })
    configureCaptcha()
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
      console.error(error)
    }
  }

  async function onSubmitOTP(e: any) {
    try {
      e?.preventDefault()
    } catch (error) {
      console.error(error)
    }
    const code = formInput.otp
    console.info({ code })
    try {
      const result = await window.confirmationResult.confirm(code)
      // User signed in successfully.
      const user = result.user
      console.info({ user })
      toast.success('user is verified')
      await link()
      setOtp(false)
      // ...
    } catch (error) {
      // User couldn't sign in (bad verification code?)
      // ...
      //toast.error("Wrong otp")
      console.error(error)
    }
  }

  async function fetchPhoneNo() {
    setLoadingState(true)
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const network = await provider.getNetwork()
    const phoneLinkContract = new ethers.Contract(
      getConfigByChain(network.chainId)[0].phoneLinkAddress,
      PhoneLink.abi,
      signer
    )
    const data = await phoneLinkContract.fetchPhoneNumber()
    console.info({ phoneLinkContract })
    console.info({ data })
    setPhoneNo(data)
    data === ''
      ? toast.error('Wallet not linked to any phone. Link Now !!')
      : toast.success(`Your wallet is already linked with ${maskPhone(data)}`)

    setLoadingState(false)
    if (data != '') {
      Router.push({ pathname: './myprofile' })
    }
  }
  async function link() {
    setLoadingState(true)
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const network = await provider.getNetwork()
    const phoneLinkContract = new ethers.Contract(
      getConfigByChain(network.chainId)[0].phoneLinkAddress,
      PhoneLink.abi,
      signer
    )
    const tx = await phoneLinkContract.enterDetails(formInput.name, signInData)
    tx.wait(1)
    toast.success('Wallet succesfully linked to your phone number')
    setLoadingState(false)
    Router.push({ pathname: '/' })
  }

  async function savePhone() {
    if (signInData == phoneNo) {
      toast.error('This number is already linked with your Wallet !!')
    } else {
      setLoadingState(true)
      const web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
      })
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const network = await provider.getNetwork()
      console.info({ network })
      const phoneLinkContract = new ethers.Contract(
        getConfigByChain(network.chainId)[0].phoneLinkAddress,
        PhoneLink.abi,
        signer
      )
      console.info('phoneLinkContract')
      const tx = await phoneLinkContract.editPhoneNumber(signInData)
      console.info('edit')
      tx.wait(1)
      toast.success('Phone Number Changed !!')
      setNewPhNo(false)
      setLoadingState(false)
      setSignInData('')
    }
  }

  return (
    <>
      <Modal isOpen={newPhNo} className={style.modalListWrapper}>
        <button
          className={` flex w-full justify-end text-white hover:text-[#fc1303]`}
          onClick={() => {
            setNewPhNo(false)
            setLoadingState(false)
            setSignInData('')
          }}
        >
          Close ❌
        </button>

        <div
          className={`${style.title} mt-8 flex w-full justify-center font-bold text-white`}
        >
          Enter New Phone Number:
        </div>

        {/* <div className={`${style.searchBar} mt-2 p-1`}>
          <PhoneInput
            className={style.searchInput}
            placeholder={phoneNo}
            value={signInData}
            id="myNewInput"
            onChange={(ph) => setSignInData(ph?.toString() ?? '')}
          />
        </div> */}
        <IdInput
          className={style.searchInput}
          id="myNewInput"
          wrapperClass={`${style.searchBar} mt-2 p-1`}
          value={signInData}
          placeholder={idPlaceholder}
          onChange={setSignInData}
        />
        {loadingState == true ? (
          <BusyLoader
            loaderType={LoaderType.Beat}
            wrapperClass="white-busy-container m-8"
            className="white-busy-container"
            color={'#ffffff'}
            size={15}
          >
            Saving data to blockchain. Please wait✋🏻...
          </BusyLoader>
        ) : (
          <button className={style.nftButton} onClick={() => savePhone()}>
            Link
          </button>
        )}
      </Modal>
      <Container>
        <div className={style.copyContainer}>
          {loadingState == true ? (
            <BusyLoader
              loaderType={LoaderType.Ring}
              color={'#ffffff'}
              size={50}
            >
              <b>Fetching data from blockchain...</b>
            </BusyLoader>
          ) : (
            <div>
              <div className={`${style.title} mt-1 p-1`}>
                Enter your Phone Number
              </div>
              {Boolean(otp) == false ? (
                <div>
                  <form onSubmit={onSignInSubmit}>
                    <div id="sign-in-button"></div>
                    <div className={style.searchBar}>
                      <input
                        className={style.searchInput}
                        placeholder="Enter your name"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <IdInput
                      className={style.searchInput}
                      id="myInput"
                      wrapperClass={`${style.searchBar} mt-2 p-1`}
                      placeholder={idPlaceholder}
                      onChange={setSignInData}
                    />
                    <button type="submit" className={style.nftButton}>
                      Get OTP
                    </button>
                  </form>
                </div>
              ) : (
                <div className={`${style.searchBarVerify} mt-2`}>
                  <form
                    onSubmit={onSubmitOTP}
                    className=" mt-4 grid grid-cols-2 gap-6"
                  >
                    <input
                      placeholder="OTP"
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          otp: e.target.value,
                        })
                      }
                    />
                    <button type="submit" className={`${style.button} p-2`}>
                      Verify OTP
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </>
  )
}

export default Home
