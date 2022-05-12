import React, { useState } from 'react'
import { CgArrowsExchangeV } from 'react-icons/cg'
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'

const style = {
    wrapper: `w-full mt-4 border border-[#151b22] rounded-xl bg-[#ffffff]] overflow-hidden`,
    titleLeft: `flex-1 flex items-center text-xl font-bold`,
    titlle: `bg-[#ffffff] px-6 py-4 flex iems-center`,
    titleIcon: `text-3xl mr-2`,
    titleRight: `text-xl`,
    tableHeader: `flex w-full bg-[#262b2f] border-y border-[#151b22] mt-8 px-4 py-1`,
}

const ToggleWindow = ({ title, component }) => {
    const [toggle, setToggle] = useState(true)
    return (
        <div className={style.wrapper}>
            <div className={style.titlle} onClick={() => setToggle(!toggle)}>
                <div className={style.titleLeft}>
                    <span className={style.titleIcon}>
                        <CgArrowsExchangeV />
                    </span>
                    {title}
                </div>
                <div className={style.titleRight}>
                    {toggle ? <AiOutlineUp /> : <AiOutlineDown />}
                </div>
            </div>
            {toggle && (
                { component }
            )}
        </div>
    )
}

export default ToggleWindow
