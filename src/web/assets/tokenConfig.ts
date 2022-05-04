export type TokenInfo = {
  name: string
  address: string
  symbol: string
  decimal: number
}

const tokenConfig: Record<number, TokenInfo[]> = {
  '80001': [
    {
      name: '---Select Your Crypto---',
      address: '0x000',
      symbol: 'SELECT',
      decimal: 18,
    },
    {
      name: 'MATIC',
      address: 'null',
      symbol: 'MATIC',
      decimal: 18,
    },
    {
      name: 'Lolo Coins',
      address: '0x90179ba681708dC36C38828153130D5B7836b7D5',
      symbol: 'LOLO',
      decimal: 18,
    },

    {
      name: "USD Tether",
      address: "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832",
      symbol: "USDT",
      decimal: 6
    }

  ],
  '4': [
    {
      name: '---Select Your Crypto---',
      address: '0x000',
      symbol: 'SELECT',
      decimal: 18,
    },
    {
      name: 'ETH',
      address: 'null',
      symbol: 'ETH',
      decimal: 18,
    },
  ],
  '242': [
    {
      name: '---Select Your Crypto---',
      address: '0x000',
      symbol: 'SELECT',
      decimal: 18,
    },
    {
      name: 'KAI',
      address: 'null',
      symbol: 'ETH',
      decimal: 18,
    },
  ],
}

export const getTokenByChain = (chain: number) => tokenConfig[chain]
