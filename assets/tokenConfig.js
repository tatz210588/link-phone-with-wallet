export const tokenConfig = {
    "80001": [

        {
            name: "---Select Your Crypto---",
            address: "0x000",
            symbol: "SELECT",
            decimal: 18
        },
        {
            name: "MATIC",
            address: "null",
            symbol: "MATIC",
            decimal: 18
        },
        {
            name: "Lolo Coins",
            address: "0x90179ba681708dC36C38828153130D5B7836b7D5",
            symbol: "LOLO",
            decimal: 18
        }
    ],
    "4": [

        {
            name: "---Select Your Crypto---",
            address: "0x000",
            symbol: "SELECT",
            decimal: 18
        },
        {
            name: "ETH",
            address: "null",
            symbol: "ETH",
            decimal: 18
        }
    ],
};

export const getTokenByChain = (chain) => tokenConfig[chain];