export const networkConfig = {
    "80001": [
        {
            phoneLinkAddress: "0xCF14441150e927F80eC771d9b002E7b25b5F85C6", //proxy deployment
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
            phoneLinkAddress: "0xFF1F17F3429aCee72F2bA1420F63BF6deE25DcdB", //proxy address
            token_icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022",
            alt: "KAI",
            networkName: "kardiachain_test"
        }
    ]
}

export const getConfigByChain = (chain) => networkConfig[chain]