export const networkConfig = {
    "80001": [
        {
            phoneLinkAddress: "0x0221c5432fE9732b973F3282bE599fC1cB997cd6", //proxy deployment
            token_icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
            alt: "MATIC",
            networkName: "Mumbai"
        },

    ],

    "4": [
        {
            phoneLinkAddress: "0x61851Aa69131E18a3f25e90B093ea40c6c2D3bB2",
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