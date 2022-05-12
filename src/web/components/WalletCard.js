import React from 'react'
import { ellipseAddress, ellipseName } from './utils'

const style = {
    wrapper: `bg-[#f4f4f6]  w-[24rem] h-[4rem] my-3 mx-1 rounded-2xl overflow-hidden `,
    wraper: `bg-[#f4f4f6]  w-[30rem] h-[6rem] my-3 mx-1 rounded-2xl overflow-hidden `,
    modalWrapper: `bg-[#303339]  w-1/2 h-2/3 mr-auto ml-auto my-28 rounded-2xl p-2 overflow-hidden  relative`,
    modalListWrapper: `bg-[#303339]  w-1/3 h-1/2 mr-auto ml-auto my-28 rounded-2xl p-2 overflow-hidden  relative overflow-auto`,
    imgContainer: `h-2/3 w-full overflow-hidden flex justify-center items-center`,
    nftImg: `w-full object-cover`,
    details: `p-3`,
    info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
    infoLeft: `flex-0.6 flex-wrap`,
    collectionName: `font-semibold text-sm text-[#8a939b]`,
    title: `relative text-white`,
    midRow: `text-white`,
    assetName: `font-bold text-lg mt-2 text-[#565759]`,
    infoRight: `flex-0.4 text-right`,
    priceTag: `font-semibold text-sm text-[#8a939b]`,
    priceValue: `flex items-center text-xl font-bold mt-2 text-[#565759]`,
    ethLogo: `h-5 mr-2`,
    likes: `text-[#8a939b] font-bold flex items-center w-full justify-end mt-3`,
    likeIcon: `text-xl mr-2`,
    nftButton: `font-bold w-full bg-pink-500 text-white text-lg rounded shadow-lg hover:bg-[#19a857] cursor-pointer mt-8 p-4`,
    searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,

}

const WalletCard = ({ detail, type }) => {
    return (
        <>
            {type == 'details' ? (
                <div id="div" className={style.wrapper} >
                    <div className={style.details}>
                        <div className={style.info}>
                            <div className={style.infoLeft}>
                                <div className={style.collectionName}>Name: {detail.name}</div>
                                <div className={style.collectionName}>{detail.typeOfIdentifier}: {detail.identifier}</div>
                            </div>

                            <div className={style.infoRight}>
                                <div className={`${style.collectionName} cursor-pointer hover:text-[#03ecfc]`}> <u>Edit</u> </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div id="div" className={style.wraper} >
                    <div className={style.details}>
                        <div className={style.info}>
                            <div className={style.infoLeft}>
                                <div className={style.collectionName}>Name: {detail.name}</div>
                                <div className={style.collectionName}>{detail.typeOfIdentifier}: {detail.identifier}</div>
                                <div className={style.collectionName}>Wallet: {detail.connectedWalletAddress}</div>
                                <div className={style.collectionName}>{detail.isPrimaryWallet}</div>
                            </div>

                            <div className={style.infoRight}>
                                <div className={`${style.collectionName} cursor-pointer hover:text-[#03ecfc]`}> <u>Edit</u> </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )

}

export default WalletCard
