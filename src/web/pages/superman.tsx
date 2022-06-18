import {useAccount,useNetwork} from 'wagmi'
import React, { useState, useEffect, KeyboardEvent } from 'react'
import toast from 'react-hot-toast'
import Router from 'next/router'
import PhoneLink from '../artifacts/contracts/phoneLink.sol/phoneLink.json'
import { getConfigByChain } from '../config'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { AiOutlineSearch } from 'react-icons/ai'
import Container from '../components/Container'
import BusyLoader, { LoaderType } from '../components/BusyLoader'
//import getFirebaseApp from"./firebase"
import Web3 from 'web3'
import axios from 'axios'

const style = {
  wrapper: `relative`,
  container: `before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('../assets/4.jpg')] before:bg-cover before:bg-center before:bg-fixed before:opacity-100 before:blur`,
  contentWrapper: `flex relative flex-wrap items-center justify-center`,
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
  const { data } = useAccount()
  const {activeChain} = useNetwork()
  const [loadingState, setLoadingState] = useState(true)
  const [details, setDetails] = useState<any[]>([])
  const [formInput, updateFormInput] = useState({ identifier: '' })
  const [admins, setAdmins] = useState()
  const [ethData,setEthData] = useState<any[]>([])

  useEffect(() => {
    loadPhoneDetails()
  }, [data?.address])

  async function loadPhoneDetails() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    /*********transaction log***********/
    /*****************This is the code get historical transactional data right*
     * from etherscan or any blockexplorer for any other network right in the react page*
     * Just uncomment ta code to see the magic. This code will show historical data*
     * of the connected wallet
     **************************************************************/
    //  const web3 = new Web3(connection)
    // // const block = await web3.eth.getBlock(92101574)
    // // for (let txhash of block.transactions){
      
    // // const tx = await web3.eth.getTransaction(txhash)
    // // if(tx.to === address || tx.from === address){
    // //   console.log({address_from: tx.from, address_to: tx.to,value:web3.utils.fromWei(tx.value,'ether')})
    // // }
    // // }
    // // console.log("block",block)

    // const endpointURL = 'https://api-rinkeby.etherscan.io/api'
    // const apiKey = "5PB2QWEDWRA9JBUWGBDHHZFM2X5YECC5Q2"
    // console.log("apiKey",endpointURL+`?module=account&action=txlist&address=${address}&page=1&offset=100&sort=desc&apikey=${apiKey}`)
    // const etherscan = await axios.get(endpointURL+`?module=account&action=txlist&address=${address}&page=1&offset=100&sort=desc&apikey=${apiKey}`)
    // setEthData(etherscan.data.result)
    //  const itemss = ethData.map((i: any) => {
    //     return{
    //       from: i.from,
    //       to: i.to ==='' ? i.contractAddress : i.to,
    //       reason: i.to === ''?'Contract Creation':'Wallet transfer',
    //       value: web3.utils.fromWei(i.value,'ether'),
    //       time: new Date(i.timeStamp*1000),
        
    //  }
    //   })
    // console.log("main",etherscan)
    // console.log("mywalley",itemss)

    /*********transaction log***********/

    console.info({ signer })
    const network = await provider.getNetwork()
    console.info({ network })
    console.log("chain", network.chainId)
    const phoneLinkContract = new ethers.Contract(
      getConfigByChain(network.chainId)[0].phoneLinkAddress,
      PhoneLink.abi,
      signer
    )
    const data = await phoneLinkContract.getPhoneToDetails()
    const items = await Promise.all(
      data.filter(i => i.typeOfIdentifier).map(async (i: any) => {
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

  const deleteAll = async () => {
    await (window as any).ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider((window as any).ethereum) //create provider
    const signer = provider.getSigner() // get signer
    const network = await provider.getNetwork()

    const phoneLinkContract = new ethers.Contract(getConfigByChain(network.chainId)[0].phoneLinkAddress, PhoneLink.abi, signer)
    const tx = await phoneLinkContract.deleteAll()
    toast.success("Database Cleared")
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
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.contentWrapper}>
          {loadingState ? (
            <BusyLoader loaderType={LoaderType.Circle} color={'#277cc2'} size={150}>
              Fetching Data From BlockChain... Please Wait...✋🏻
            </BusyLoader>
          ) : !details.length ? (
            <div className={`${style.spinner} mb-4 text-5xl font-bold`}>
              DATABASE IS EMPTY !!
            </div>
          ) : (
            <div className={`overflow-hidden mt-8`}>
              <div className={style.midRow}>
                <div className={style.title} onClick={() => deleteAll()}>Database</div>
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
        </div>
      </div></div>
  )
}

export default Home
