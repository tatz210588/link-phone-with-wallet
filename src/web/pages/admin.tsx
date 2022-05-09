import { useWeb3 } from '@3rdweb/hooks'
import React, { useState, useEffect, KeyboardEvent } from 'react'
import toast from 'react-hot-toast'
import Router from 'next/router'
import PhoneLink from '../../artifacts/contracts/phoneLink.sol/phoneLink.json'
import { getConfigByChain } from '../config'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { AiOutlineSearch } from 'react-icons/ai'
import Container from '../components/Container'
import BusyLoader, { LoaderType } from '../components/BusyLoader'
//import getFirebaseApp from"./firebase"

const style = {
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
  const { address, chainId } = useWeb3()
  const [loadingState, setLoadingState] = useState(true)
  const [details, setDetails] = useState<any[]>([])
  const [formInput, updateFormInput] = useState({ identifier: '' })
  const [admins, setAdmins] = useState()

  useEffect(() => {
    loadPhoneDetails()
  }, [])

  async function loadPhoneDetails() {
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
    const data = await phoneLinkContract.getPhoneToDetails()
    const items = await Promise.all(
      data.map(async (i: any) => {
        let item = {
          name: i.name,
          identifier: i.identifier,
          connectedWalletAddress: i.connectedWalletAddress,
          typeOfIdentifier: i.typeOfIdentifier,
          isPrimaryWallet: i.isPrimaryWallet
        }
        return item
      })
    )
    setDetails(items)
    toast.success('Data fetched successfully !!')
    setLoadingState(false)
  }

  async function search(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      setLoadingState(true)
      if (
        '' === (document.getElementById('searchBar') as HTMLInputElement)?.value
      ) {
        loadPhoneDetails()
      } else {
        const web3Modal = new Web3Modal({
          network: 'mainnet',
          cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const network = await provider.getNetwork()
        const phoneLinkContract = new ethers.Contract(
          getConfigByChain(network.chainId)[0].phoneLinkAddress, PhoneLink.abi, signer)
        const data = await phoneLinkContract.fetchAllWalletAddress(
          formInput.identifier
        )
        const items = await Promise.all(
          data.map(async (i: any) => {
            let item = {
              name: i.name,
              identifier: i.identifier,
              connectedWalletAddress: i.connectedWalletAddress,
              typeOfIdentifier: i.typeOfIdentifier,
              isPrimaryWallet: i.isPrimaryWallet
            }
            return item
          })
        )
        if (!items.length) {
          toast.error('Please provide phone number with ISD Code.')
          setLoadingState(false)
        } else {
          setDetails(items)
          setLoadingState(false)
        }
      }
    }
  }

  return (
    <Container>
      {loadingState ? (
        <BusyLoader loaderType={LoaderType.Circle} color={'#277cc2'} size={150}>
          Fetching Data From BlockChain... Please Wait...✋🏻
        </BusyLoader>
      ) : !details.length ? (
        <div className={`${style.spinner} mb-4 text-5xl font-bold`}>
          DATABASE IS EMPTY !!
        </div>
      ) : (
        <div className={`mt-8`}>
          <div className={style.midRow}>
            <div className={style.title}>Database</div>
            <div className={style.searchBar}>
              <div className={style.searchIcon}>
                <AiOutlineSearch />
              </div>
              <input
                className={style.searchInput}
                id="searchBar"
                placeholder="Please provide phone number with ISD Code."
                onChange={(e) =>
                  updateFormInput({
                    ...formInput,
                    identifier: e.target.value,
                  })
                }
                onKeyDown={(e) => search(e)}
              />
            </div>
          </div>
          <div className="flex flex-wrap">
            <section className="my-10 mx-5 rounded-3xl bg-[#3699eb]">
              <div className="container">
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4">
                    <div className="max-w-full overflow-x-auto rounded">
                      <table className="w-full table-auto rounded-md rounded-3xl">
                        <thead>
                          <tr className="bg-primary text-center">
                            <th className="w-1/6 min-w-[160px] border-l border-transparent py-4 px-3 text-lg font-semibold text-white lg:py-7 lg:px-4">
                              Sl. No.
                            </th>
                            <th className="w-1/6 min-w-[160px] py-4 px-3 text-lg font-semibold text-white lg:py-7 lg:px-4">
                              Name.
                            </th>
                            <th className=" w-1/6 min-w-[160px] py-4 px-3 text-lg font-semibold text-white lg:py-7 lg:px-4">
                              Phone/Email.
                            </th>
                            <th className=" w-1/6 min-w-[160px] py-4 px-3 text-lg font-semibold text-white lg:py-7 lg:px-4">
                              Ph no/EmailID.
                            </th>
                            <th className="w-1/6 min-w-[160px] py-4 px-3 text-lg font-semibold text-white lg:py-7 lg:px-4">
                              Wallet Address
                            </th>
                            <th className="w-1/6 min-w-[160px] py-4 px-3 text-lg font-semibold text-white lg:py-7 lg:px-4">
                              Is Primary?
                            </th>
                          </tr>
                        </thead>
                        <tbody className="rounded-2xl">
                          {details.map((detail, id) => (
                            <tr key={id} className="rounded-3xl">
                              <td className="text-dark border-b border-l border-[#E8E8E8] bg-[#ebecf2] py-5 px-2 text-center text-base font-medium">
                                {id + 1}
                              </td>
                              <td className="text-dark border-b border-[#E8E8E8] bg-[#eadaeb] py-5 px-2 text-center text-base font-medium">
                                {detail.name}
                              </td>
                              <td className="text-dark border-b border-[#E8E8E8] bg-[#ebeada] py-5 px-2 text-center text-base font-medium">
                                {detail.typeOfIdentifier}
                              </td>
                              <td className="text-dark border-b border-[#E8E8E8] bg-[#fffbc2] py-5 px-2 text-center text-base font-medium">
                                {detail.identifier}
                              </td>
                              <td className="text-dark border-b border-[#E8E8E8] bg-[#83eff2] py-5 px-2 text-center text-base font-medium">
                                {detail.connectedWalletAddress}
                              </td>
                              <td className="text-dark border-b border-[#E8E8E8] bg-[#adffb7] py-5 px-2 text-center text-base font-medium">
                                {detail.isPrimaryWallet == true ? 'Y' : 'N'}
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
      )}
    </Container>
  )
}

export default Home
