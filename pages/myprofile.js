import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { useWeb3 } from '@3rdweb/hooks';
import { getConfigByChain } from '../config';
import { ethers } from 'ethers'
import PhoneLink from '../artifacts/contracts/phoneLink.sol/phoneLink.json'
import RingLoader from 'react-spinners/RingLoader'
import Modal from 'react-modal'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import firebase from "../components/firebase"
import toast, { Toaster } from "react-hot-toast"
import Router from 'next/router'


const style = {
    wrapper: `relative`,
    modalListWrapper: `bg-[#303339]  w-1/3 h-1/2 mr-auto ml-auto my-28 rounded-2xl p-2 overflow-hidden  relative overflow-auto`,
    container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('../assets/4.jpg')] before:bg-cover before:bg-center before:bg-fixed before:opacity-100 before:blur`,
    contentWrapper: `flex h-screen relative justify-center flex-wrap items-start`,
    center: ` h-screen relative justify-center flex-wrap items-center `,
    searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
    copyContainer: `w-1/2 mt-8`,
    title: `relative text-white text-[46px] font-semibold`,
    button: `font-bold w-full mt-2 bg-[#eb77f2] text-white text-lg rounded shadow-lg hover:bg-[#e134eb] cursor-pointer`,
    description: `text-[#8a939b] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
    midRow: `text-white`,
    description: `text-[#fff] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
    spinner: `w-full h-screen flex justify-center text-white mt-20 p-100 object-center`,
    nftButton: `font-bold w-full mt-4 bg-pink-500 text-white text-lg rounded p-4 shadow-lg hover:bg-[#19a857] cursor-pointer`,
    dropDown: `font-bold w-full mt-4 bg-[#2181e2] text-white text-lg rounded p-4 shadow-lg cursor-pointer`,
    editItem: `text-[#000000] hover:text-[#81817c] cursor-pointer`,
}

const myprofile = () => {
    const [src, setSrc] = useState("");
    const { address, chainId } = useWeb3()
    const [phno, setPhno] = useState(null)
    const [loadingState, setLoadingState] = useState(false)
    const [editphonenumber, seteditphonenumber] = useState()
    const [value, setValue] = useState()
    const [otp, setOtp] = useState(false)
    const [formInput, updateFormInput] = useState({ otp: '' })


    useEffect(() => {
        window.ethereum.request({ method: 'eth_requestAccounts' }) // get the connected wallet address
            .then(result => {
                QRCode.toDataURL(result[0]).then((data) => { //Generate QR code for the connected wallet address
                    setSrc(data);
                })
            })
        fetchPhno()

    }, [address, chainId])

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
                //toast.error("OTP not sent due to technical issue. Please try later.");
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
            toast.success("OTP verified. Encoding new phone number. Please Wait...")
            savePhone()
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

        await window.ethereum.send("eth_requestAccounts") // opens up metamask extension and connects Web2 to Web3
        const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
        const signer = provider.getSigner() // get signer
        const network = await provider.getNetwork()
        let data = null
        const phoneLinkContract = new ethers.Contract(getConfigByChain(network.chainId)[0].phoneLinkAddress, PhoneLink.abi, signer)
        data = await phoneLinkContract.fetchPhoneNumber()
        if (data === '') {
            Router.push({ pathname: '/register' })
        } else {
            setPhno(data)
        }
        setLoadingState(false)

    }

    async function savePhone() {
        if (value == phno) {
            toast.error("This number is already linked with your Wallet !!")
        } else {
            setLoadingState(true)

            await window.ethereum.send("eth_requestAccounts") // opens up metamask extension and connects Web2 to Web3
            const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
            const signer = provider.getSigner() // get signer
            const network = await provider.getNetwork() // get the network

            const phoneLinkContract = new ethers.Contract(getConfigByChain(network.chainId)[0].phoneLinkAddress, PhoneLink.abi, signer)
            const tx = await phoneLinkContract.editPhoneNumber(value)
            tx.wait(1)
            toast.success("Phone Number Changed !!")
            setLoadingState(false)
            seteditphonenumber(false)
            Router.push({ pathname: './' })
            setValue('')
        }
    }

    return (

        <div className={style.wrapper}>
            <Toaster position="top-center" reverseOrder={false} />
            <Modal isOpen={editphonenumber} className={style.modalListWrapper}>
                <button className={` w-full flex justify-end text-white hover:text-[#fc1303]`} onClick={() => {
                    seteditphonenumber(false)
                    setLoadingState(false)
                    setValue('')
                }}>Close ❌</button>

                <div>

                    {Boolean(otp) == false ? (
                        <div >
                            <div className={`${style.title} mt-1 p-1`}>
                                Enter your Phone Number
                            </div>
                            <form onSubmit={onSignInSubmit} >
                                <div id="sign-in-button"></div>
                                <div >
                                    <PhoneInput
                                        placeholder="Enter phone number"
                                        value={value} id="myInput"
                                        onChange={setValue} />
                                </div>

                                <button type="submit" className={style.nftButton} >Get OTP</button>
                            </form>


                        </div>
                    ) : (

                        <div className={`${style.searchBarVerify} mt-2`}>
                            <div className={`${style.title} mt-1 p-1`}>
                                Enter OTP
                            </div>
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
            </Modal>
            <div className={style.container}>
                <div className={style.contentWrapper}>
                    {loadingState == true ? (
                        <div className={style.spinner}>
                            <RingLoader className={style.spinner} color={'#ffffff'} size={50} />
                            <p><b>Fetching data from blockchain...</b></p>
                        </div>
                    ) : (
                        <div className=' mt-4 grid grid-cols-3 gap-1 w-1/2'>
                            <a href={src} download><img src={src} /></a>
                            <div className={style.description}>
                                My Phone: {phno}
                                &nbsp;<u><i className={style.editItem} onClick={() => { seteditphonenumber(true) }}>edit</i></u>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default myprofile
