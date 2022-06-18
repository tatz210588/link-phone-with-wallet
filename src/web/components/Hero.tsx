import React from 'react'
import Router from 'next/router'
import Home from '../assets/home.png'
import Image from 'next/image'
import logo from '../assets/QR.png'
import Container from './Container'
import { CgProfile } from 'react-icons/cg'
import { AiOutlineQrcode } from 'react-icons/ai'
import { BsCashCoin } from 'react-icons/bs'

const style = {
  wrapper: `relative`,
  container: `flex flex-wrap before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('../assets/4.jpg')] before:bg-cover before:bg-center before:bg-fixed before:opacity-100 before:blur`,
  contentWrapper: `w-[95%] lg:w-full m-4 h-screen relative justify-center flex-wrap items-center block flex-grow lg:flex lg:items-center lg:w-auto`,
  copyContainer: `w-full justify-center items-center lg:w-1/2`,
  title: `relative text-white justify-center text-2xl lg:text-[46px] font-semibold`,
  description: `text-[#8a939b] container-[400px] text-xl lg:text-2xl mt-[0.8rem] mb-[2.5rem]`,
  ctaContainer: `flex`,
  accentedButton: ` relative text-lg px-4 lg:px-12 py-4 font-semibold bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
  button: ` relative text-lg font-semibold px-4 lg:px-12 py-4 bg-[#363840]  rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
  cardContainer: `rounded-[7rem] mt-4 mb-4`,
  infoContainer: `h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white`,
  author: `flex flex-col justify-center ml-4`,
  name: ``,
  infoIcon: `flex justify-end items-center flex-1 text-[#8a939b] text-3xl font-bold`,
}

const Hero = () => {
  
  return (

    <div className={style.wrapper}>

      <div className={style.container}>
        <div className={style.contentWrapper}>
          <div className={style.copyContainer}>
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
              ><BsCashCoin size={50} />

              </button>

              <button className={style.accentedButton}
                onClick={() => {
                  Router.push({ pathname: '/qrPay' })
                }}><AiOutlineQrcode size={50} />
              </button>

              <button
                className={style.button}
                onClick={() => {
                  Router.push({ pathname: '/register' })
                }}
              >
                Register
              </button>

            </div>
          </div>
          <div className={style.cardContainer}>
            <Image className="rounded-t-lg flex flex-wrap h-[50%] lg:h-full lg:w-full" src={Home} alt="" />
          </div>
        </div>
      </div>
    </div>

  )
}

export default Hero
