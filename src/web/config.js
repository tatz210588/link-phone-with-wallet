export const networkConfig = {
    "80001": [
        {
            phoneLinkAddress: "0xc577F566D73851F945acbA2Def79884ea0B29818", //proxy deployment
            token_icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
            alt: "MATIC",
            networkName: "Mumbai"
        },

    ],

    "4": [
        {
            phoneLinkAddress: "0xc62773E07ab521DB2366Ea441D47ccFA6F15c005", //proxy deployment
            token_icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022",
            alt: "ETH",
            networkName: "Rinkeby"

        },
    ],

    "242": [
        {
            phoneLinkAddress: "0x90179ba681708dC36C38828153130D5B7836b7D5", //proxy address
            token_icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022",
            alt: "KAI",
            networkName: "kardiachain_test"
        }
    ]
}

export const getConfigByChain = (chain) => networkConfig[chain]