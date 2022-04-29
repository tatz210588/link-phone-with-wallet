export const networkConfig = {
    "80001": [
        {
            //phoneLinkAddress: "0x10d8D49EdF424E8772a36A62201b23895D0D7b9e", //original deployment
            phoneLinkAddress: "0x1e7Be8f97745B08ACa98d1537b46307A45cCBCAE", //proxy deployment
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