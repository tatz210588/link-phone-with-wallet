import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Image from 'next/image'
import logo from '../assets/logo.png'
// import PhoneInput from 'react-phone-number-input'
import Link from 'next/link'
import { AiOutlineSearch } from 'react-icons/ai'
import { FcSettings } from 'react-icons/fc'
import { CgProfile } from 'react-icons/cg'
import { AiOutlineQrcode } from 'react-icons/ai'
import { BsCashCoin } from 'react-icons/bs'
import { ConnectWallet } from '@3rdweb/react'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import PhoneLink from '../artifacts/contracts/phoneLink.sol/phoneLink.json'
import { getConfigByChain } from '../config'
import Web3Modal from 'web3modal'
import { useWeb3 } from '@3rdweb/hooks'
import { ellipseAddress } from './utils'
import toast from 'react-hot-toast'
// import CircleLoader from 'react-spinners/CircleLoader'
// import Modal from 'react-modal'
// import qrlogo from '../assets/QR.png'

const solutions = [
  {
    name: 'MY Profile',
    description: 'Get your QR code, connected details and linked wallets.',
    href: '/myprofile',
    icon: FcSettings,
  },
  {
    name: 'Send Crypto',
    description: 'Send your crypto to your friend on his phone/email ID directly.',
    href: '/pay',
    icon: BsCashCoin,
  },
  {
    name: 'Scan',
    description: 'Scan and send crypto to your friend directly on his/her QR code.',
    href: '/qrPay',
    icon: AiOutlineQrcode,
  },
]

const style = {
  header_main: `header-main`,
  wrapper: `bg-[#E6CF7C] w-screen px-[1.2rem] py-[0.8rem] flex justify-center`,
  logoContainer: `flex items-center cursor-pointer`,
  logoText: ` ml-[0.8rem] text-black font-semibold text-2xl`,
  searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
  searchIcon: `text-[#8a939b] mx-3 font-bold text-lg`,
  searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
  headerItems: ` flex items-center justify-end`,
  headerItem: `text-white px-4 font-bold text-[#000000] hover:text-[#81817c] cursor-pointer`,
  headerIcon: `text-[#8a939b] text-3xl font-black px-4 hover:text-white cursor-pointer focus:outline-none focus:border-white`,
  profileImgContainer: `w-40 h-40 z-40 object-cover rounded-full  mt-[-5rem]`,
  modalListWrapper: `bg-[#303339]  w-1/3 h-1/3 mr-auto ml-auto my-28 rounded-2xl p-2 overflow-hidden  relative overflow-auto`,
  title: `relative text-white text-[32px] font-semibold`,
  description: `text-[#fff] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
  ctaContainer: `flex`,
  spinner: `w-full h-screen flex justify-center text-white mt-20 p-100 object-center`,
  accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
  button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
  nftButton: `font-bold w-full mt-4 bg-[#eb77f2] text-white text-lg rounded p-4 shadow-lg hover:bg-[#e134eb] cursor-pointer`,
}

const Header = () => {
  const { address } = useWeb3()
  const [admin, setAdmin] = useState<typeof address>()
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!window.ethereum) {
      toast.error(
        'Install a crypto wallet(ex: Metamask, Coinbase, etc..) to proceed'
      )
    } else if (!address) {
      toast.error('Connect Your Wallet.')
    } else {
      toast.success(`Welcome ${ellipseAddress(address)} !!`)
      getAdmin()
    }
    setDone(true)
  }, [address])

  async function getAdmin() {
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
    const data = await phoneLinkContract.getMarketOwner()
    setAdmin(data) //comment this line to withdraw admin restrictions
    //setAdmin(address) //comment this line to restrict admin access
  }

  return (
    <>
      <div className={style.wrapper}>
        <Link href="/">
          <div className={style.logoContainer}>
            <Image src={logo} height={40} width={40} />
            <div className={style.logoText}>GrowPay</div>
          </div>
        </Link>
        <div className={style.headerItems}>
          <Link href="/">
            <div className={style.headerItem}>Home</div>
          </Link>
          <Link href="/register">
            <div className={style.headerItem}>Link Wallet</div>
          </Link>
          {address === admin && address ? (
            <Link href="/superman">
              <div className={style.headerItem}>Admin</div>
            </Link>
          ) : (
            <div className={style.headerItems}></div>
          )}

          {address && (
            <Popover.Group as="nav" className={style.headerIcon}>
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button>
                      <span>
                        <CgProfile />
                      </span>
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="relative grid gap-6 bg-[#dfe8f7] px-5 py-6 sm:gap-8 sm:p-8">
                            {solutions.map((item, i) => (
                              <Link key={i} href={item.href}>
                                <div className="-m-3 flex items-start rounded-lg p-3 hover:bg-[#b6f7fc]">
                                  <item.icon
                                    key={i}
                                    className="h-6 w-6 flex-shrink-0 text-indigo-600"
                                    aria-hidden="true"
                                  />
                                  <div className="ml-4">
                                    <p className="text-base font-medium text-gray-900">
                                      {item.name}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </Popover.Group>
          )}
          <ConnectWallet />
        </div>
      </div>
    </>
  )
}

export default Header
