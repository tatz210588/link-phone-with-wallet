
import { useWeb3 } from '@3rdweb/hooks';
import React, { useState, useEffect } from 'react'
import toast, { Toaster } from "react-hot-toast"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import PhoneLink from '../artifacts/contracts/phoneLink.sol/phoneLink.json'
import { getConfigByChain } from '../config';
import Web3Modal from "web3modal"
import { ethers } from 'ethers'
import BeatLoader from "react-spinners/BeatLoader";
import Modal from 'react-modal'
import { maskPhone } from '../components/utils'
import axios from 'axios';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import firebase from "../components/firebase"
import Router from "next/router"
import RingLoader from 'react-spinners/RingLoader'

const style = {
    wrapper: `relative`,
    container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('../assets/4.jpg')] before:bg-cover before:bg-center before:bg-fixed before:opacity-100 before:blur`,
    contentWrapper: `flex h-screen relative justify-center flex-wrap items-center`,
    center: ` h-screen relative justify-center flex-wrap items-center `,
    searchBar: `flex flex-1 w-max-[520px] items-center bg-[#d5e1f7] rounded-[0.8rem] hover:bg-[#757199]`,
    searchBarVerify: `flex flex-1 w-max-[520px] items-center rounded-[0.8rem]`,
    searchInput: `h-full w-full border-0 bg-transparent outline-0 ring-0 px-2 rounded-3xl pl-0 text-[#000000] placeholder:text-[#8a939b]`,
    copyContainer: `w-1/2`,
    modalListWrapper: `bg-[#303339]  w-1/3 h-1/3 mr-auto ml-auto my-28 rounded-2xl p-2 overflow-hidden  relative overflow-auto`,
    title: `relative text-white text-[32px] font-semibold`,
    midRow: `text-white`,
    description: `text-[#fff] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
    ctaContainer: `flex`,
    spinner: `w-full h-screen flex justify-center text-white mt-20 p-100 object-center`,
    accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
    button: `font-bold w-full mt-2 bg-[#eb77f2] text-white text-lg rounded shadow-lg hover:bg-[#e134eb] cursor-pointer`,
    nftButton: `font-bold w-full mt-4 bg-[#eb77f2] text-white text-lg rounded p-4 shadow-lg hover:bg-[#e134eb] cursor-pointer`,

}

const Home = () => {
    const { address, chainId } = useWeb3();
    const [value, setValue] = useState()
    const [formInput, updateFormInput] = useState({ name: '', otp: '' })
    const [loadingState, setLoadingState] = useState(false)
    const [newPhNo, setNewPhNo] = useState()
    const [phno, setPhno] = useState('')
    const [otp, setOtp] = useState(false)


    useEffect(() => {
        document.getElementById('myInput').value = ''
        fetchPhno()
    }, [])

    async function configureCaptcha() {
        const auth = getAuth();
        window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                console.log("recaptcha verifying");
                onSignInSubmit();
                console.log("recaptha verified");
            }
        }, auth);
    }

    async function onSignInSubmit(e) {
        try {
            e.preventDefault()
        } catch (error) {
            console.log(error)
        }
        console.log("step1")
        configureCaptcha()
        const phoneNumber = value
        console.log("phno", phoneNumber)

        const appVerifier = window.recaptchaVerifier;
        const auth = getAuth();
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                toast.success("OTP sent. Please enter the OTP")
                setOtp(true)
                // ...
            }).catch((error) => {
                // Error; SMS not sent
                // ...
                toast.error("OTP not sent due to technical issue. Please try later.");
                console.log("error", error)
            });

    }
    async function onSubmitOTP(e) {
        try {
            e.preventDefault()
        } catch (error) {
            console.log(error)
        }
        const code = formInput.otp
        console.log("code", code)
        window.confirmationResult.confirm(code).then((result) => {
            // User signed in successfully.
            const user = result.user;
            console.log(JSON.stringify(user))
            toast.success("user is verified")
            link()
            setOtp(false)
            // ...
        }).catch((error) => {
            // User couldn't sign in (bad verification code?)
            // ...
            toast.error("Wrong otp")
        });
    }


    async function fetchPhno() {
        setLoadingState(true)
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const network = await provider.getNetwork()
        const phoneLinkContract = new ethers.Contract(getConfigByChain(network.chainId)[0].phoneLinkAddress, PhoneLink.abi, signer)
        const data = await phoneLinkContract.fetchPhoneNumber()
        console.log("phContract", phoneLinkContract)
        console.log("data", data)
        setPhno(data)
        data === '' ? toast.error("Wallet not linked to any phone. Link Now !!") :
            toast.success(`Your wallet is already linked with ${maskPhone(data)}`)

        setLoadingState(false)
        if (data != '') {
            Router.push({ pathname: './myprofile' })
        }

    }
    async function link() {
        setLoadingState(true)
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const network = await provider.getNetwork()
        const phoneLinkContract = new ethers.Contract(getConfigByChain(network.chainId)[0].phoneLinkAddress, PhoneLink.abi, signer)
        const tx = await phoneLinkContract.enterDetails(formInput.name, value)
        tx.wait(1)
        toast.success("Wallet succesfully linked to your phone number")
        setLoadingState(false)
        Router.push({ pathname: "/" })
    }
    async function savePhone() {
        if (value == phno) {
            toast.error("This number is already linked with your Wallet !!")
        } else {
            setLoadingState(true)
            const web3Modal = new Web3Modal({
                network: "mainnet",
                cacheProvider: true,
            })
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            const network = await provider.getNetwork()
            console.log("network", network)
            const phoneLinkContract = new ethers.Contract(getConfigByChain(network.chainId)[0].phoneLinkAddress, PhoneLink.abi, signer)
            console.log("phcontr")
            const tx = await phoneLinkContract.editPhoneNumber(value)
            console.log("edit")
            tx.wait(1)
            toast.success("Phone Number Changed !!")
            setNewPhNo(false)
            setLoadingState(false)
            setValue('')
        }
    }


    return (

        <div className={style.wrapper}>
            <Toaster position="top-center" reverseOrder={false} />

            <Modal isOpen={newPhNo} className={style.modalListWrapper}>
                <button className={` w-full flex justify-end text-white hover:text-[#fc1303]`} onClick={() => {
                    setNewPhNo(false)
                    setLoadingState(false)
                    setValue('')
                }}>Close ❌</button>

                <div className={`${style.title} w-full flex justify-center font-bold text-white mt-8`}>
                    Enter New Phone Number:
                </div>

                <div className={`${style.searchBar} mt-2 p-1`}>
                    <PhoneInput className={style.searchInput}
                        placeholder={phno}
                        value={value} id="myNewInput"
                        onChange={setValue} />
                </div>
                {loadingState == true ? (
                    <div className={`${style.midRow} m-8`}>
                        <BeatLoader className={style.midRow} color={'#ffffff'} loading={loadingState} size={15} />
                        Saving data to blockchain. Please wait✋🏻...
                    </div>
                ) : (
                    <button
                        className={style.nftButton}
                        onClick={() => savePhone()}>Link</button>)}
            </Modal>

            <div className={style.container}>
                <div className={style.contentWrapper}>
                    <div className={style.copyContainer}>
                        {loadingState == true ? (
                            <div className={style.spinner}>
                                <RingLoader className={style.spinner} color={'#ffffff'} size={50} />
                                <p><b>Fetching data from blockchain...</b></p>

                            </div>
                        ) : (
                            <div>

                                <div className={`${style.title} mt-1 p-1`}>
                                    Enter your Phone Number
                                </div>
                                {Boolean(otp) == false ? (
                                    <div >
                                        <form onSubmit={onSignInSubmit} >
                                            <div id="sign-in-button"></div>
                                            <div className={style.searchBar}>
                                                <input className={style.searchInput}
                                                    placeholder='Enter your name'
                                                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                                                />
                                            </div>
                                            <div className={`${style.searchBar} mt-2 p-1`}>
                                                <PhoneInput className={`${style.searchInput}`}
                                                    placeholder="Enter phone number"
                                                    value={value} id="myInput"
                                                    onChange={setValue} />
                                            </div>
                                            <button type="submit" className={style.nftButton} >Get OTP</button>
                                        </form>
                                    </div>
                                ) : (

                                    <div className={`${style.searchBarVerify} mt-2`}>
                                        <form onSubmit={onSubmitOTP} className=' mt-4 grid grid-cols-2 gap-6'>
                                            <input
                                                placeholder='OTP'
                                                onChange={e => updateFormInput({ ...formInput, otp: e.target.value })}
                                            />
                                            <button type="submit" className={`${style.button} p-2`}>Verify OTP</button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div >


    )
}

export default Home
