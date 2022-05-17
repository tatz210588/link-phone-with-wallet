import React, { useState, useEffect } from 'react'
import PhoneInput from 'react-phone-number-input'
import { FirebaseApp } from 'firebase/app'
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from 'firebase/auth'
import getFirebaseApp from './firebase'
import { ellipseAddress, randomString } from './utils'
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast'
import { useWeb3 } from '@3rdweb/hooks'
import { getConfigByChain } from '../config'
import { ethers } from 'ethers'
import PhoneLink from '../artifacts/contracts/phoneLink.sol/phoneLink.json'
import BusyLoader, { LoaderType } from './BusyLoader'
import Router from 'next/router'
import { NextPage } from 'next'



const style = {
    wrapper: `bg-[#f4f4f6]  w-[26rem] h-[5rem] my-3 mx-1 rounded-2xl overflow-hidden `,
    wraper: `bg-[#f4f4f6]  w-[95%] h-[100%] my-3 mx-1 rounded-2xl overflow-hidden `,
    details: `p-3`,
    info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
    searchBarVerify: `flex flex-1 w-max-[520px] items-center rounded-[0.8rem]`,
    infoLeft: `flex-0.6 flex-wrap`,
    collectionName: `font-semibold text-sm text-[#8a939b]`,
    title: `relative text-white`,
    infoRight: `flex-0.4 text-right`,
    button: ` relative text-sm bg-[#3d9931] p-1 rounded text-[#e4e8ea] hover:bg-[#2de815] cursor-pointer`,
}

export type WalletCardDetail = {
    name: string
    identifier: string
    typeOfIdentifier: string
    connectedWalletAddress: string
    isPrimaryWallet: Boolean
    // i.isPrimaryWallet == true ? 'Primary Wallet' : 'Secondary Wallet',
}

type WalletCardProps = {
    detail: WalletCardDetail
    type: string
}

const WalletCard: NextPage<WalletCardProps> = ({ detail, type }) => {
    const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | undefined>()
    const [savebutton, setSaveButton] = useState(false)
    const [formInput, updateFormInput] = useState({ name: '', otp: '', identifier: '', type: '', })
    const [value, setValue] = useState<string | undefined>()
    const [otp, setOtp] = useState(false)
    const [emailOTP, setEmailOTP] = useState('')
    const [loadingState, setLoadingState] = useState(false)

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
                    onSignInSubmit().then((_) => console.info('recaptcha verified'))
                },
            },
            auth
        )
    }

    async function onSignInSubmit(e?: any) {
        try {
            e.preventDefault()
        } catch (error) {
            console.log(error)
        }

        if (detail.typeOfIdentifier === 'email') {
            var OTP = randomString(10, 'base64')
            setEmailOTP(OTP)
            var templateParams = { user: formInput.name, email: formInput.identifier, message: OTP }
            emailjs.send('service_t2xue7p', 'template_dnzci4u', templateParams, 'Z8B2Ufr9spWJFx4js')
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text)
                    toast.success("Check email for OTP")
                }, function (error) {
                    console.log('FAILED...', error)
                })
            setOtp(true)

        } else if (detail.typeOfIdentifier === 'phone') {
            configureCaptcha()
            const phoneNumber = value
            if (phoneNumber) {
                const appVerifier = window.recaptchaVerifier
                const auth = getAuth()
                signInWithPhoneNumber(auth, phoneNumber, appVerifier)
                    .then((confirmationResult) => {
                        // SMS sent. Prompt user to type the code from the message, then sign the
                        // user in with confirmationResult.confirm(code).
                        window.confirmationResult = confirmationResult
                        toast.success("OTP sent. Please enter the OTP")
                        setOtp(true)
                        // ...
                    }).catch((error) => {
                        // Error; SMS not sent
                        // ...
                        //toast.error("OTP not sent due to technical issue. Please try later.");
                        console.log("error", error)
                    })
            }
        }
        else {
            toast.error("Please enter phone/email to proceed.")
        }
    }

    async function onSubmitOTP(e?: any) {
        try {
            e.preventDefault()
        } catch (error) {
            console.log(error)
        }
        if (detail.typeOfIdentifier === 'email') {
            if (emailOTP.toString() == formInput.otp) {
                toast.success("Email Authenticated")
                await update()
                setOtp(false)
            } else {
                toast.error("Wrong OTP entered.")
            }
        } else {
            const code = formInput.otp
            console.log("code", code)
            window.confirmationResult.confirm(code).then((result) => {
                // User signed in successfully.
                const user = result.user
                console.log(JSON.stringify(user))
                toast.success("user is verified")
                //await update()
                setOtp(false)
                // ...
            }).catch((error) => {
                // User couldn't sign in (bad verification code?)
                // ...
                //toast.error("Wrong otp")
                console.log(error)
            })
        }
    }

    async function update() {
        setLoadingState(true)
        await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
        const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
        const signer = provider.getSigner() // get signer
        const network = await provider.getNetwork()
        const phoneLinkContract = new ethers.Contract(getConfigByChain(network.chainId)[0].phoneLinkAddress, PhoneLink.abi, signer)
        let tx
        if (detail.identifier === 'phone') {
            tx = await phoneLinkContract.editProfile(detail.name, value, detail.typeOfIdentifier, detail.identifier)
        } else { //email
            tx = await phoneLinkContract.editProfile(detail.name, formInput.identifier, detail.typeOfIdentifier, detail.identifier)
        }
        tx.wait(1)
        setLoadingState(false)
        toast.success(`${detail.typeOfIdentifier} details updated successfully.`)
        Router.push({ pathname: './' })
    }

    async function makePrimary() {
        setLoadingState(true)
        await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
        const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
        const signer = provider.getSigner() // get signer
        const network = await provider.getNetwork()
        const phoneLinkContract = new ethers.Contract(getConfigByChain(network.chainId)[0].phoneLinkAddress, PhoneLink.abi, signer)
        const tx = await phoneLinkContract.makePrimary(detail.connectedWalletAddress, detail.identifier)

        tx.wait(1)
        setTimeout(() => {
            setLoadingState(false)
            toast.success(`Details updated successfully.`)
            Router.push({ pathname: './' })
        }, 10000)

    }

    return (
        <>
            {loadingState === true ? (
                <BusyLoader loaderType={LoaderType.Beat} color={'#ffffff'} size={10}>
                    <b>Connection established to blockchain...Do not refresh</b>
                </BusyLoader>
            ) : (
                <>
                    {type === 'details' ? (
                        <div id="div" className={style.wrapper} >
                            <div className={style.details}>
                                <div className={style.info}>
                                    {Boolean(otp) === false ? (
                                        <>
                                            <div className={style.infoLeft}>

                                                <div className={style.collectionName}>Name: {detail.name}</div>
                                                <div className={style.collectionName}>{detail.typeOfIdentifier}:
                                                    {savebutton === true ? (
                                                        detail.typeOfIdentifier === 'phone' ? (
                                                            <PhoneInput
                                                                value={value}
                                                                onChange={setValue}
                                                                placeholder={detail.identifier}
                                                            />
                                                        ) : (
                                                            <input type='email' placeholder={detail.identifier}
                                                                onChange={(e) =>
                                                                    updateFormInput({
                                                                        ...formInput, identifier: e.target.value, type: 'email'
                                                                    })} />
                                                        )

                                                    ) : (
                                                        <b>{detail.identifier}</b>
                                                    )}
                                                </div>

                                            </div>


                                            <div className={style.infoRight}>
                                                <div >
                                                    {savebutton === true ? (
                                                        <div id="sign-in-button">
                                                            <button className={style.button} onClick={onSignInSubmit}>
                                                                GET OTP
                                                            </button>
                                                            <button className={`ml-2 text-[#fc0303] hover:text-[#fc0303]`} onClick={() => {
                                                                setSaveButton(false)
                                                                setValue('')
                                                            }}>
                                                                <b>X</b>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className={`${style.collectionName} cursor-pointer hover:text-[#03ecfc]`} onClick={() => setSaveButton(true)}>
                                                            <u>Edit</u>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        </>
                                    ) : (
                                        <div className={`${style.searchBarVerify} mt-2`}>
                                            <form
                                                onSubmit={onSubmitOTP}
                                            //className=" mt-4 grid grid-cols-2 gap-6"
                                            >
                                                <input className={`w-[10rem]`}
                                                    placeholder="OTP"
                                                    onChange={(e) =>
                                                        updateFormInput({ ...formInput, otp: e.target.value })
                                                    }
                                                />
                                                <button className={`${style.button} p-1 ml-2`}>
                                                    Verify
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div id="div" className={style.wraper} >
                            <div className={style.details}>
                                <div className={style.info}>
                                    <div className={style.infoLeft}>
                                        <div className={style.collectionName}>Name: {detail.name}</div>
                                        <div className={style.collectionName}>{detail.typeOfIdentifier}: {detail.identifier}</div>
                                        <div className={style.collectionName}>Wallet: {detail.connectedWalletAddress}</div>
                                        <div className={style.collectionName}>{detail.isPrimaryWallet ? 'Primary Wallet' : 'Secondary Wallet'}</div>
                                    </div>

                                    <div className={style.infoRight}>
                                        <div >
                                            {detail.isPrimaryWallet ? (
                                                null
                                            ) : (
                                                <div className={`${style.collectionName} text-[#f54b42] cursor-pointer hover:text-[#03ecfc]`} onClick={() => makePrimary()}>
                                                    <u>Set Primary</u>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    }
                </>
            )}
        </>
    )

}

export default WalletCard
