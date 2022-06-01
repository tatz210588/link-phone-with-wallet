import React from 'react'
import Router from 'next/router'
import Image from 'next/image'
import { CgProfile } from 'react-icons/cg'
import { AiOutlineQrcode } from 'react-icons/ai'
import { BsCashCoin } from 'react-icons/bs'
import Typed from 'react-typed'
// import Lottie, { LottieProps } from 'react-lottie'

import Container from './Container'
import { IdTypeName } from './IdInput'
import Home from '../assets/home.png'
import logo from '../assets/QR.png'
// import * as ethAnimeData from '../assets/ethereum.json'

const style = {
  copyContainer: `w-3/5 my-2`,
  title: `relative text-[#277cc2] text-[46px] font-semibold`,
  description: `text-[#fffbeb] container-[400px] text-xl mt-[0.8rem] mb-[2.5rem]`,
  ctaContainer: `flex`,
  qrButton: ` relative text-lg font-semibold bg-[#2181e2] rounded-lg mr-5 text-white cursor-pointer`,
  accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
  button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840]  rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
  cardContainer: `rounded-[7rem] my-2`,
  infoContainer: `h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white`,
  author: `flex flex-col justify-center ml-4`,
  name: ``,
  infoIcon: `flex justify-end items-center flex-1 text-[#8a939b] text-3xl font-bold`,
}

// const ethereumAnimation: LottieProps['options'] = {
//   loop: true,
//   autoplay: true,
//   animationData: ethAnimeData,
//   rendererSettings: {
//     preserveAspectRatio: 'xMidYMid slice',
//   },
// }

// const animeSize = 240

const Hero = () => {
  return (
    <Container>
      <div className={`${style.copyContainer} `}>
        <div className={style.title}>
          <span>Transact Crypto</span>
          {/* <Lottie
            options={ethereumAnimation}
            height={animeSize}
            width={animeSize}
            speed={0.6}
          /> */}
          <br />
          <span> through </span>
          <Typed
            strings={[IdTypeName.phone, IdTypeName.email, IdTypeName.wallet]}
            typeSpeed={80}
            backSpeed={40}
            backDelay={2500}
            loop
            showCursor={false}
          />
        </div>
        <div className={style.description}>
          Forget the era of wallet address and send crypto directly to phone
          number now.
        </div>
        <div className={style.ctaContainer}>
          <button
            className={style.accentedButton}
            title="Send Crypto"
            onClick={() => {
              Router.push({
                pathname: '/pay',
              })
            }}
          >
            <BsCashCoin size={50} />
          </button>

          <button
            className={style.accentedButton}
            title="Scan and Send Crypto"
            onClick={() => {
              Router.push({ pathname: '/qrPay' })
            }}
          >
            <AiOutlineQrcode size={50} />
          </button>

          <button
            className={style.button}
            title="Link your Wallet"
            onClick={() => {
              Router.push({ pathname: '/register' })
            }}
          >
            Register
          </button>
        </div>
      </div>
      <div className={`${style.cardContainer} `}>
        <Image className="w-1/2 rounded-t-lg " src={Home} alt="" />

        <div className={style.infoContainer}>
          <img
            className="h-[2.5rem] rounded-full"
            src="https://lh3.googleusercontent.com/hKfUfZcOpvGfsNz4p6Pu9b2ckD4MRFcL-XbwPuZ2PwtOynFloE85nekShDqAZcN0JCFBAXPX_royc9Lx1k_gAJJmqJLyoPhnvjWi4g=s80"
            alt=""
          />
          <div className={style.author}>
            <div className={style.name}>Tatz</div>
            <a
              className="text-[#1868b7]"
              href="https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/43617070992181872498657409852160512582181349889597339264956620564284712157185"
            >
              Tathagat
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Hero
