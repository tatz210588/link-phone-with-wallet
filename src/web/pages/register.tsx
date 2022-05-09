import { useWeb3 } from '@3rdweb/hooks'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import 'react-phone-number-input/style.css'
import PhoneLink from '../../artifacts/contracts/phoneLink.sol/phoneLink.json'
import { getConfigByChain } from '../config'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { ellipseAddress, randomString } from '../components/utils'
import emailjs from '@emailjs/browser'
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
import IdInput, { IdType } from '../components/IdInput'

const style = {
  center: ` h-screen relative justify-center flex-wrap items-center `,
  searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#ffffff] rounded-[0.8rem] `,
  searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#000000] placeholder:text-[#fffffff]`,
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
  const [signInData, setSignInData] = useState('')
  const [formInput, updateFormInput] = useState({
    name: '',
    otp: '',
    identifier: '',
    type: '',
  })
  const [loadingState, setLoadingState] = useState(false)
  const { address } = useWeb3()
  const [phoneNo, setPhoneNo] = useState(null)
  const [otp, setOtp] = useState(false)
  const [emailOTP, setEmailOTP] = useState('')
  const [checked, setChecked] = useState(true)
  const [isPrimary, setIsPrimary] = useState(false)

  useEffect(() => {
    //const myInput = document.getElementById('myInput') as HTMLInputElement
    //myInput.value = ''
    getWalletDetails()
  }, [address])

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
          challengeIdentity().then((_) => console.info('recaptcha verified'))
        },
      },
      auth
    )
  }

  async function onSignInSubmit(e?: any) {
    try {
      e?.preventDefault()
    } catch (error) {
      console.error(error)
    }
    console.info({ signInData })
    configureCaptcha()
    challengeIdentity()
  }

  async function challengeIdentity() {
    switch (formInput.type) {
      case IdType.email:
        var emailOtp = randomString(10, 'base64')
        setEmailOTP(emailOtp)
        var templateParams = {
          user: formInput.name,
          email: formInput.identifier,
          message: emailOtp,
        }

        setOtp(true)
        try {
          await emailjs.send(
            'service_t2xue7p',
            'template_dnzci4u',
            templateParams,
            'Z8B2Ufr9spWJFx4js'
          )
          toast.success(
            <>
              OTP has been sent successfully to{' '}
              {ellipseAddress(formInput.identifier, 4)}
              <br />
              Please check your email.
            </>
          )
        } catch (error) {
          console.error(error)
          toast.error('Unable to send OTP to the given email...')
          setOtp(false)
        }
        break
      case IdType.phone:
        console.log('phone otp')
        const signInPhoneNumber = signInData
        console.info({ signInPhoneNumber })

        const appVerifier = window.recaptchaVerifier
        const auth = getAuth(firebaseApp)
        try {
          setOtp(true)
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = await signInWithPhoneNumber(
            auth,
            signInPhoneNumber,
            appVerifier
          )
          toast.success('OTP sent. Please enter the OTP')
        } catch (error) {
          console.error(error)
          toast.error('Unable to send OTP to the given phone no...')
          setOtp(false)
        }
        break
      default:
        toast.error('Please enter phone/email to proceed.')
        break
    }
  }

  async function onSubmitOTP(e: any) {
    try {
      e?.preventDefault()
    } catch (error) {
      console.error(error)
    }
    switch (formInput.type) {
      case IdType.email:
        if (emailOTP === formInput.otp) {
          toast.success('Email Authenticated')
          await link()
        } else {
          toast.error('Wrong OTP entered.')
        }
        setOtp(false)
        break
      case IdType.phone:
        const code = formInput.otp
        console.info({ code })
        try {
          const result = await window.confirmationResult.confirm(code)
          // User signed in successfully.
          const user = result.user
          console.info({ user })
          toast.success('user is verified')
          await link()
          // ...
        } catch (error) {
          // User couldn't sign in (bad verification code?)
          // ...
          //toast.error("Wrong otp")
          console.error(error)
        }
        setOtp(false)
        break
      default:
        toast.error('Unsupported OTP entered.')
        break
    }
  }

  async function getWalletDetails() {
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
    //const data = await phoneLinkContract.fetchPhoneNumber()
    const data = await phoneLinkContract.getWalletDetails(address)
    const items = await Promise.all(
      data.map(async (i: any) => {
        let item = {
          name: i.name,
          identifier: i.identifier,
          typeOfIdentifier: i.typeOfIdentifier,
          connectedWalletAddress: i.connectedWalletAddress,
          isPrimaryWallet: i.isPrimaryWallet,
        }
        if (item.isPrimaryWallet == true) {
          setIsPrimary(true)
        }
        return item
      })
    )
    setPhoneNo(items[0].typeOfIdentifier)
    //setChecked(items[0].isPrimaryWallet ? items[0].isPrimaryWallet : false)

    setLoadingState(false)
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
    console.log('checked', checked)
    const tx = await phoneLinkContract.enterDetails(
      formInput.name,
      formInput.identifier,
      formInput.type,
      checked
    )
    tx.wait(1)
    toast.success(`Wallet succesfully linked to your ${formInput.type}`)
    setLoadingState(false)
    Router.push({ pathname: '/' })
  }

  function setIdValue(value: string, inputType: IdType) {
    updateFormInput({
      ...formInput,
      identifier: value,
      type: inputType.toString(),
    })
    setSignInData(value)
  }

  return (
    <>
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
                      onChange={setIdValue}
                      excludeIdTypes={[IdType.wallet]}
                    />

                    {phoneNo &&
                      (isPrimary == false ? (
                        <div>
                          <input
                            className={`mt-2 ml-4 mr-4 h-7 w-7 rounded-lg p-1`}
                            type="checkbox"
                            defaultChecked={checked}
                            onChange={() => {
                              console.log('checked', checked)
                              setChecked(!checked)
                              console.log('checked', checked)
                            }}
                          />

                          <b className={style.description}>
                            Set this wallet as your primary wallet
                          </b>
                        </div>
                      ) : null)}
                    <button type="submit" className={style.nftButton}>
                      Submit
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
                        updateFormInput({ ...formInput, otp: e.target.value })
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
