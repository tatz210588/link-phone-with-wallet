export const networkConfig = {
    "80001": [
        {
            phoneLinkAddress: "0x6Ee89F6d43fd9d40dbB3cDbCA1692c99A090f72C", //proxy deployment
            token_icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
            alt: "MATIC",
            networkName: "Mumbai"
        },

    ],

    "4": [
        {
            phoneLinkAddress: "0xF09f5824c693804Be9573f5f75f7d3f0F97e1437", //proxy deployment
            token_icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022",
            alt: "ETH",
            networkName: "Rinkeby"

        },
    ],
    "3":[
        {
        phoneLinkAddress:"0x9192f607A91D50c555656E6392675FdC0D9620D3", //proxy
        token_icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022",
            alt: "ETH",
            networkName: "Kovan"
        }
    ],
    "1313161555":[
        {
            phoneLinkAddress: "0x9414C157938bf269414da2c2fd3e776d10Ca050C", //proxy deployment
            token_icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022",
            alt: "ETH",
            networkName: "Aurora_Testnet"
        }

    ],
    "24":[
        {
            phoneLinkAddress: "0xdD7Fa6c4BDC6B48859C88a28ad1b9A7993991a81", //proxy address
            token_icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022",
            alt: "KAI",
            networkName: "kardiachain_main"
        }
    ],

    "242": [
        {
            phoneLinkAddress: "0x588e0570DD24a8CFFDF1fC43840f77Ca7C7c9499", //proxy address
            token_icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022",
            alt: "KAI",
            networkName: "kardiachain_test"
        }
    ]
}

export const getConfigByChain = (chain) => networkConfig[chain]