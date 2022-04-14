
import { useWeb3 } from '@3rdweb/hooks';
import React, { useState, useEffect } from 'react'
import toast, { Toaster } from "react-hot-toast"
import Router from 'next/router'
import PhoneLink from '../artifacts/contracts/phoneLink.sol/phoneLink.json'
import { getConfigByChain } from '../config';
import Web3Modal from "web3modal"
import { ethers } from 'ethers'
import CircleLoader from "react-spinners/CircleLoader";
import { AiOutlineSearch } from "react-icons/ai"
//import firebase from "./firebase"

const style = {
    wrapper: `relative`,
    container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('../assets/4.jpg')] before:bg-cover before:bg-center before:bg-fixed before:opacity-100 before:blur`,
    contentWrapper: `flex h-screen relative justify-center flex-wrap items-center`,
    center: ` h-screen relative justify-center flex-wrap items-center `,
    searchBar: `flex flex-1 mx-[0.8rem]  items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
    copyContainer: `w-1/2`,
    title: `relative text-white text-[46px] font-semibold`,
    searchIcon: `text-[#8a939b] mx-3 font-bold text-lg`,
    midRow: `text-white`,
    description: `text-[#fff] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
    ctaContainer: `flex`,
    spinner: `w-full h-screen flex justify-center text-[#000000] mt-20 p-100 object-center`,
    accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
    button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
    nftButton: `font-bold w-full mt-4 bg-pink-500 text-white text-lg rounded p-4 shadow-lg hover:bg-[#19a857] cursor-pointer`,

}

const Home = () => {
    const { address, chainId } = useWeb3();
    const [loadingState, setLoadingState] = useState(true)
    const [details, setDetails] = useState()
    const [formInput, updateFormInput] = useState({ phoneNumber: '' })
    const [admins, setAdmins] = useState()


    useEffect(() => {
        loadPhoneDetails()
    }, [])

    async function loadPhoneDetails() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const network = await provider.getNetwork()
        const phoneLinkContract = new ethers.Contract(getConfigByChain(network.chainId)[0].phoneLinkAddress, PhoneLink.abi, signer)
        const data = await phoneLinkContract.getPhoneToDetails()
        const items = await Promise.all(data.map(async i => {
            let item = {
                name: i.name,
                phoneNumber: i.phoneNumber,
                connectedWalletAddress: i.connectedWalletAddress
            }
            return item
        }))
        setDetails(items)
        toast.success("Data fetched successfully !!")
        setLoadingState(false)

    }

    async function search(e) {
        if (e.key === 'Enter') {
            setLoadingState(true)
            if (document.getElementById('searchBar').value === '') {
                loadPhoneDetails()
            } else {

                const web3Modal = new Web3Modal({
                    network: "mainnet",
                    cacheProvider: true,
                })
                const connection = await web3Modal.connect()
                const provider = new ethers.providers.Web3Provider(connection)
                const signer = provider.getSigner()
                const network = await provider.getNetwork()
                const phoneLinkContract = new ethers.Contract(getConfigByChain(network.chainId)[0].phoneLinkAddress, PhoneLink.abi, signer)
                const data = await phoneLinkContract.fetchWalletAddress(formInput.phoneNumber)
                const items = await Promise.all(data.map(async i => {
                    let item = {
                        phoneNumber: i.phoneNumber,
                        connectedWalletAddress: i.connectedWalletAddress
                    }
                    return item
                }))
                if (!items.length) {
                    toast.error("Please provide phone number with ISD Code.")
                    setLoadingState(false);
                } else {
                    setDetails(items)
                    setLoadingState(false)
                }
            }

        }

    }




    return (

        <div className={style.wrapper}>
            <div className={style.container}>
                <div className={style.contentWrapper}>
                    {loadingState === true ? (
                        <div className={style.spinner}>
                            <CircleLoader className={style.spinner} color={'#277cc2'} loading={loadingState} size={150} />
                            Fetching Data From BlockChain...
                            Please Wait...✋🏻
                        </div>
                    ) : (!details.length ? (
                        <div className={`${style.spinner} text-5xl font-bold mb-4`}>DATABASE IS EMPTY !!

                        </div>
                    ) : (
                        <div className={`${style.infoContainer} mt-8`}>


                            <div className={style.midRow}>
                                <div className={style.title}>Database</div>
                                <div className={style.searchBar}>
                                    <div className={style.searchIcon}>
                                        <AiOutlineSearch />
                                    </div>
                                    <input className={style.searchInput} id="searchBar"
                                        placeholder='Please provide phone number with ISD Code.'
                                        onChange={e => updateFormInput({ ...formInput, phoneNumber: e.target.value })}
                                        onKeyDown={e => search(e)} />
                                </div>
                            </div>
                            <div className="flex flex-wrap">
                                <section class="bg-[#3699eb] my-10 mx-5 rounded-3xl">
                                    <div class="container">
                                        <div class="flex flex-wrap -mx-4">
                                            <div class="w-full px-4">
                                                <div class="max-w-full overflow-x-auto">
                                                    <table class="table-auto w-full rounded-md rounded-3xl ">
                                                        <thead>
                                                            <tr class="bg-primary text-center">
                                                                <th
                                                                    class="
                           w-1/6
                           min-w-[160px]
                           text-lg
                           font-semibold
                           text-white
                           py-4
                           lg:py-7
                           px-3
                           lg:px-4
                           border-l border-transparent
                           "
                                                                >
                                                                    Sl. No.
                                                                </th>
                                                                <th
                                                                    class="
                           w-1/6
                           min-w-[160px]
                           text-lg
                           font-semibold
                           text-white
                           py-4
                           lg:py-7
                           px-3
                           lg:px-4
                           "
                                                                >
                                                                    Ph No.
                                                                </th>
                                                                <th
                                                                    class="
                           w-1/6
                           min-w-[160px]
                           text-lg
                           font-semibold
                           text-white
                           py-4
                           lg:py-7
                           px-3
                           lg:px-4
                           "
                                                                >
                                                                    Name.
                                                                </th>
                                                                <th
                                                                    class="
                           w-1/6
                           min-w-[160px]
                           text-lg
                           font-semibold
                           text-white
                           py-4
                           lg:py-7
                           px-3
                           lg:px-4
                           "
                                                                >
                                                                    Wallet Address
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody class="rounded-2xl">
                                                            {details.map((detail, id) => (
                                                                <tr class="rounded-3xl">
                                                                    <td
                                                                        class="
                           text-center text-dark
                           font-medium
                           text-base
                           py-5
                           px-2
                           bg-[#F3F6FF]
                           border-b border-l border-[#E8E8E8]
                           "
                                                                    >
                                                                        {id + 1}
                                                                    </td>
                                                                    <td
                                                                        class="
                           text-center text-dark
                           font-medium
                           text-base
                           py-5
                           px-2
                           bg-white
                           border-b border-[#E8E8E8]
                           "
                                                                    >
                                                                        {detail.phoneNumber}
                                                                    </td>
                                                                    <td
                                                                        class="
                           text-center text-dark
                           font-medium
                           text-base
                           py-5
                           px-2
                           bg-white
                           border-b border-[#E8E8E8]
                           "
                                                                    >
                                                                        {detail.name}
                                                                    </td>
                                                                    <td
                                                                        class="
                           text-center text-dark
                           font-medium
                           text-base
                           py-5
                           px-2
                           bg-[#F3F6FF]
                           border-b border-[#E8E8E8]
                           "
                                                                    >
                                                                        {detail.connectedWalletAddress}
                                                                    </td>

                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>


                            </div>

                        </div>

                    ))}

                </div>
            </div></div>


    )
}

export default Home
