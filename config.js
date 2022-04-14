export const networkConfig = {
    "80001": [
        {
            phoneLinkAddress: "0x10d8D49EdF424E8772a36A62201b23895D0D7b9e",
            token_icon: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=022",
            alt: "MATIC",
            networkName: "Mumbai"
        },

    ],

    "4": [
        {       //not yet deployed
            phoneLinkAddress: "0x15d819282A10AE7C7F1eFC4d167E52fA50fB4709",
            token_icon: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022",
            alt: "ETH",
            networkName: "Rinkeby"

        },
    ],
};

export const getConfigByChain = (chain) => networkConfig[chain];