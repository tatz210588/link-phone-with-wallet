import React from 'react'
import Router from 'next/router'
import Home from '../assets/home.png'
import Image from 'next/image'
import logo from '../assets/QR.png'
import Container from './Container'

const style = {
  copyContainer: `w-1/2`,
  title: `relative text-[#277cc2] text-[46px] font-semibold`,
  description: `text-[#fffbeb] container-[400px] text-xl mt-[0.8rem] mb-[2.5rem]`,
  ctaContainer: `flex`,
  qrButton: ` relative text-lg font-semibold bg-[#2181e2] rounded-lg mr-5 text-white cursor-pointer`,
  accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
  button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840]  rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
  cardContainer: `rounded-[7rem]`,
  infoContainer: `h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white`,
  author: `flex flex-col justify-center ml-4`,
  name: ``,
  infoIcon: `flex justify-end items-center flex-1 text-[#8a939b] text-3xl font-bold`,
}

const Hero = () => {
  return (
    <Container>
      <div className={`${style.copyContainer} `}>
        <div className={style.title}>Send crypto to phone number</div>
        <div className={style.description}>
          Forget the era of wallet address and send crypto directly to phone
          number now.
        </div>
        <div className={style.ctaContainer}>
          <button
            className={style.accentedButton}
            onClick={() => {
              Router.push({
                pathname: '/pay',
              })
            }}
          >
            Pay to Phone
          </button>

          <button
            className={style.button}
            onClick={() => {
              Router.push({ pathname: '/register' })
            }}
          >
            Register
          </button>
          <button className={style.button}>Send NFT</button>
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
