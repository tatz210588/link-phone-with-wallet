import path from 'path'

export const ellipseAddress = (address: string, width = 5) =>
  address && address.length > 2 * width
    ? `${address.slice(0, width)}...${address.slice(-width)}`
    : address

export const maskPhone = (address: string, width = 5) =>
  address && address.length > width + 2
    ? `${address.slice(0, width)}xxx${address.slice(-2)}`
    : address

export const ellipseName = (address: string, width = 15) =>
  address && address.length > width ? `${address.slice(0, width)}...` : address

export const rounded = (balance: string, length = 6) =>
  balance && balance.length > length ? balance.slice(0, length) : balance

const _baseUrl = (chainId?: number) => {
  switch (chainId) {
    case 80001:
      return 'https://mumbai.polygonscan.com/'
    case 4:
      return 'https://rinkeby.etherscan.io/'
    default:
      throw Error(`value: ${chainId} is not a valid chainId`)
  }
}

export const createUrlToken = (address = '', chainId?: number) =>
  path.join(_baseUrl(chainId), 'token', address)

export const createUrlAddress = (address = '', chainId?: number) =>
  path.join(_baseUrl(chainId), 'address', address)
