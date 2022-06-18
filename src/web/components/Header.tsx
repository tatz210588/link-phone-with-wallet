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
import {ConnectButton} from '@rainbow-me/rainbowkit'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import PhoneLink from '../artifacts/contracts/phoneLink.sol/phoneLink.json'
import { getConfigByChain } from '../config'
import Web3Modal from 'web3modal'
import {useAccount,useNetwork} from 'wagmi'
import { ellipseAddress } from './utils'
import toast from 'react-hot-toast'
import { FaRegAddressCard } from 'react-icons/fa'
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
  {
    name: 'KYC',
    description: 'Upload your KYC documents to increase transfer limit',
    href: '#',
    icon: FaRegAddressCard,
  },
]

const style = {
  wrapper: `flex flex-wrap items-end content-around bg-[#E6cf7c] px-[1.2rem] p-1 `,
  logoContainer: `flex items-center lg:py-4 flex-shrink-0 text-[#000000] mr-6 cursor-pointer`,
  logoText: ` ml-[0.8rem] font-semibold text-2xl tracking-tight text-[#000000]`,
  headerItemsTab: `w-full  block flex-grow lg:flex lg:items-center lg:w-auto`,
  headerItems: `text-md lg:flex justify-end items-center font-bold lg:flex-grow`,
  headerItem: `block mt-4 lg:inline-block lg:text-right lg:mt-0 lg:mb-2 py-2 text-[#000000] hover:text-[#81817C] mr-6 cursor-pointer`,
  headerIcon: `block lg:inline-block lg:mt-0 text-[#000000]  text-3xl hover:text-[#81817C] mr-4 cursor-pointer focus:outline-none`,
  img: `fill-current h-8 w-8 mr-2`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  infoRight: `flex-0.4 text-right`,
}

const Header = () => {
  const { data } = useAccount()
  const {activeChain} = useNetwork()
  const [admin, setAdmin] = useState<any>()
  const [done, setDone] = useState(false)
  const [openMenu, setOpenMenu] = React.useState(true)

  const handleBtnClick = () => {
    setOpenMenu(!openMenu)
  }

  useEffect(() => {
    if (!(window as any).ethereum) {
      toast.error(
        'Install a crypto wallet(ex: Metamask, Coinbase, etc..) to proceed'
      )
    } else if (!data) {
      toast.error('Connect Your Wallet.')
    } else {
      toast.success(`Welcome ${ellipseAddress(data?.address)} !!`)
      getAdmin()
    }
    setDone(true)
  }, [data?.address])

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
    <nav className="flex items-center justify-between flex-wrap bg-[#E6cf7c] px-2">
      <Link href="/">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <Image className={style.img} src={logo} height={40} width={40} />
          <div className={style.logoText}>GrowPay</div>
        </div>
      </Link>
      <div className="block lg:hidden">
        <button onClick={handleBtnClick} className="flex items-center px-3 py-2 border rounded text-[#000000] border-[#000000] hover:text-white hover:border-white">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
        </button>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        {openMenu && (
          <div className={style.headerItemsTab}>
            <div className={style.headerItems}>
              <Link href="/">
                <div className={style.headerItem}>Home</div>
              </Link>
              <Link href="/register">
                <div className={style.headerItem}>Link Wallet</div>
              </Link>
              {data?.address === admin && data ? (
                <Link href="/superman">
                  <div className={style.headerItem}>Admin</div>
                </Link>
              ) : (
                <div className={style.headerItem}></div>
              )}

              {data?.address && (
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
                          <Popover.Panel className="absolute z-10 -ml-4 mt-3 lg:w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
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
              <div className={style.headerItem}>
                <ConnectButton showBalance={false}  />
              </div>
            </div>
          </div>
        )}

      </div>
    </nav>

  )
}

export default Header
