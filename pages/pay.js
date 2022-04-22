import React, { useState, useEffect } from 'react'
import { getTokenByChain } from '../assets/tokenConfig'
import { getConfigByChain } from '../config';
import { useWeb3 } from '@3rdweb/hooks';
import { rounded } from '../components/utils'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js';
import PhoneInput from 'react-phone-number-input'
import BeatLoader from 'react-spinners/BeatLoader';
import RingLoader from 'react-spinners/RingLoader'
import 'react-phone-number-input/style.css'
import toast, { Toaster } from "react-hot-toast"
import PhoneLink from '../artifacts/contracts/phoneLink.sol/phoneLink.json'


const style = {
    wrapper: `relative`,
    container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('../assets/4.jpg')] before:bg-cover before:bg-center before:bg-fixed before:opacity-100 before:blur`,
    contentWrapper: `flex h-screen relative justify-center flex-wrap items-start`,
    center: ` h-screen relative justify-center flex-wrap items-center `,
    searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
    copyContainer: `w-1/2`,
    title: `relative text-white text-[46px] font-semibold`,
    midRow: `text-white`,
    description: `text-[#fff] container-[400px] text-md mb-[2.5rem]`,
    spinner: `w-full h-screen flex justify-center text-white mt-20 p-100 object-center`,
    nftButton: `font-bold w-full mt-4 bg-pink-500 text-white text-lg rounded p-4 shadow-lg hover:bg-[#19a857] cursor-pointer`,
    dropDown: `font-bold w-full mt-4 bg-[#2181e2] text-white text-lg rounded p-4 shadow-lg cursor-pointer`,

}

const Pay = () => {

    const { chainId } = useWeb3();
    //const chainName = getNetworkMetadata(chainId).chainName;
    //const chainId = '80001'
    const [value, setValue] = useState(null)
    const [balanceToken, setbalanceToken] = useState(0);
    const [formInput, updateFormInput] = useState({ amount: 0 })
    const [selectedToken, setSelectedToken] = useState()
    const [loadingState, setLoadingState] = useState(false)
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [loadingBalanceState, setLoadingBalanceState] = useState(false)

    useEffect(() => {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(result => {
                setDefaultAccount(result[0]); //get existing wallet address
            })
    }, [defaultAccount])

    async function loadBalance(selectToken) {
        setSelectedToken(selectToken)
        setLoadingState(true)
        await window.ethereum.send("eth_requestAccounts") // opens up metamask extension and connects Web2 to Web3
        const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider

        if (selectToken != 0) {

            if (selectToken.address != 'null') {//if selected token address is non-native token
                const tokenContract = new ethers.Contract(selectToken.address, PhoneLink.abi, provider)
                const data = await tokenContract.balanceOf(defaultAccount)
                const pow = new BigNumber('10').pow(new BigNumber(selectToken.decimal))
                setbalanceToken(web3BNToFloatString(data, pow, 0, BigNumber.ROUND_DOWN))
            } else {//if selected token is native token
                provider.getBalance(defaultAccount).then((balance) => {
                    const balanceInEth = ethers.utils.formatEther(balance)
                    setbalanceToken(rounded(balanceInEth))
                })

            }
            setLoadingState(false)

        } else {
            toast.error('Enter Valid details please!!')
        }

    }
    function web3BNToFloatString(
        bn,
        divideBy,
        decimals,
        roundingMode = BigNumber.ROUND_DOWN
    ) {
        const converted = new BigNumber(bn.toString())
        const divided = converted.div(divideBy)
        return divided.toFixed(decimals, roundingMode)
    }

    async function transfer() {

        if (selectedToken != null && formInput.amount > 0 && value != null) {
            if (balanceToken > formInput.amount) {
                setLoadingState(true)

                await window.ethereum.send("eth_requestAccounts") // opens up metamask extension and connects Web2 to Web3
                const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
                const signer = provider.getSigner() // get signer
                ethers.utils.getAddress(defaultAccount)//checks if an address is valid one
                const network = await provider.getNetwork()

                const tokenContract = new ethers.Contract(selectedToken.address, PhoneLink.abi, signer)
                const amount = ethers.utils.parseUnits(formInput.amount, 'ether')
                const phoneLinkContract = new ethers.Contract(getConfigByChain(network.chainId)[0].phoneLinkAddress, PhoneLink.abi, signer)
                const to = await phoneLinkContract.fetchWalletAddress(value) //gets the addresses linked to the phone number

                if (to.length == 0) { //means your friend has not yet linked his/her wallet
                    toast.error("The given phone number is not linked any wallet. Ask your friend to link his Phone")
                } else {
                    const items = await Promise.all(to.map(async i => {
                        let item = {
                            phoneNumber: i.phoneNumber,
                            connectedWalletAddress: i.connectedWalletAddress
                        }
                        return item
                    }))

                    if (selectedToken.address != 'null') { //for non-native coin
                        const tx = await tokenContract.transfer(items[0].connectedWalletAddress, amount) //transfers tokens from msg.sender to destination wallet
                        tx.wait(1)
                    } else { //for native coin            
                        const tx = await signer.sendTransaction({
                            to: items[0].connectedWalletAddress, //destination wallet address
                            value: amount // amount of native token to be sent
                        })
                        tx.wait(1)
                    }
                    toast.success("Transfer Successful.")
                }
                setLoadingState(false)
            } else {
                toast.error("You need more balance to execute this transaction.")
            }
        } else {
            toast.error("Please fill all the details correctly")
        }

    }

    return (
        <div>

            <div className={style.wrapper}>
                <Toaster position="top-center" reverseOrder={false} />
                <div className={style.container}>
                    <div className={style.contentWrapper}>
                        {!chainId ? (
                            <div className={style.spinner}>
                                <RingLoader className={style.spinner} color={'#ffffff'} size={50} />
                                <p><b>Click on the Connect Wallet button !!</b></p>

                            </div>
                        ) : (
                            <div className={style.copyContainer}>
                                <div className={`${style.title} mt-1 p-1`}>
                                    Transfer Currency to Phone !!
                                </div>

                                <div className=' mt-4 grid grid-cols-2 gap-2'>
                                    <select className={style.dropDown} onChange={(e) => {
                                        if (e.target.value != 0) {
                                            const token = (getTokenByChain(chainId)[e.target.value])
                                            setSelectedToken(token)
                                            loadBalance(getTokenByChain(chainId)[e.target.value])
                                            setLoadingBalanceState(true)
                                        } else {
                                            setSelectedToken(null)
                                            setLoadingBalanceState(false)
                                        }
                                    }}>
                                        {getTokenByChain(chainId).map((token, index) => (
                                            <option value={index} key={token.address}>{token.name}</option>
                                        ))}
                                    </select>



                                    {loadingBalanceState === true && (
                                        <div className={style.description}>
                                            Available Balance: {balanceToken}
                                        </div>
                                    )}
                                </div>
                                <div className=' mt-4 grid grid-cols-2 gap-1'>

                                    <div className={`${style.searchBar} mt-2 p-1`}>
                                        <PhoneInput
                                            placeholder="Enter phone number"
                                            value={value} id="myNewInput"
                                            onChange={setValue} />
                                    </div>

                                    <div className={`${style.searchBar} mt-2 p-1`}>
                                        <input className={style.searchInput}
                                            placeholder='Amount to transfer'
                                            onChange={e => {
                                                updateFormInput({ ...formInput, amount: e.target.value })
                                            }}
                                        />
                                    </div>


                                </div>

                                {loadingState === true ? (
                                    <div className={style.midRow}>
                                        Connecting to blockchain. Please wait<BeatLoader className={style.midRow} color={'#ffffff'} loading={loadingState} size={15} />

                                    </div>
                                ) : (
                                    <div>
                                        {

                                            <div >

                                                <button onClick={() => {
                                                    transfer()
                                                }} className={style.nftButton}>Tranfer</button>
                                            </div>

                                        }

                                    </div>
                                )}
                            </div>)}

                    </div>
                </div>
            </div>
        </div >
    )



}
export default Pay

