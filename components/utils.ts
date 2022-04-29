

export function ellipseAddress(address = '', width = 5) {
    if (!address) {
        return ''
    }
    return `${address.slice(0, width)}...${address.slice(-width)}`
}

export function maskPhone(address = '', width = 5) {
    if (!address) {
        return ''
    }
    return `${address.slice(0, width)}xxx${address.slice(-2)}`
}

export function ellipseName(address = '', width = 15) {
    if (!address) {
        return ''
    }
    return `${address.slice(0, width)}...`
}
export function rounded(balance = '', length = 6) {

    return `${balance.slice(0, length)}`
}

export function createUrltoken(address = '', chainId = '') {
    let baseUrl;
    if (chainId === 80001) {
        baseUrl = 'https://mumbai.polygonscan.com/token/'
    }
    if (chainId === 4) {
        baseUrl = 'https://rinkeby.etherscan.io/token/'
    }
    return `${baseUrl}${address}`
}

export function createUrlAddress(address = '', chainId = '') {
    let baseUrl;
    if (chainId === 80001) {
        baseUrl = 'https://mumbai.polygonscan.com/address/'
    }
    if (chainId === 4) {
        baseUrl = 'https://rinkeby.etherscan.io/address/'
    }
    return `${baseUrl}${address}`
}
