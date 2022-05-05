import { ethers } from 'ethers'
import { getTokenByChain, TokenInfo } from '../assets/tokenConfig'
import PhoneLink from '../../artifacts/contracts/phoneLink.sol/phoneLink.json'
import BigNumber from 'bignumber.js'
import { rounded } from './utils'
import toast from 'react-hot-toast'
import { getConfigByChain } from '../config'

export type PaymentData = {
  defaultChainId?: number
  defaultAccount?: any
  selectedToken?: TokenInfo
  availableTokens: TokenInfo[]
  balanceToken?: string
  walletName?: string
}

const PaymentHelper = () => {
  let _data: PaymentData = { availableTokens: [] }

  const web3BNToFloatString = (
    bn: any,
    divideBy: BigNumber,
    decimals: number,
    roundingMode = BigNumber.ROUND_DOWN
  ) => {
    const converted = new BigNumber(bn.toString())
    const divided = converted.div(divideBy)
    return divided.toFixed(decimals, roundingMode)
  }

  return {
    data: () => _data,
    connectWallet: (chainId?: number) => {
      _data.defaultChainId = chainId
      if (chainId) _data.availableTokens = getTokenByChain(chainId)
      console.info({ chainId, availableTokens: _data.availableTokens })
    },
    initialize: async () => {
      const result: any[] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      _data.defaultAccount = result[0] //get existing wallet address

      console.info({ _data })
    },
    fetchDetails: async (address: string) => {
      window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
      const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
      const signer = provider.getSigner() // get signer
      ethers.utils.getAddress(_data.defaultAccount) //checks if an address is valid one
      const network = await provider.getNetwork()

      const phoneLinkContract = new ethers.Contract(
        getConfigByChain(network.chainId)[0].phoneLinkAddress,
        PhoneLink.abi,
        signer
      )
      const data = await phoneLinkContract.getWalletDetails(address)
      const items = await Promise.all(
        data.map(async (i: any) => {
          let item = {
            name: i.name,
            phoneNumber: i.phoneNumber,
            connectedWalletAddress: i.connectedWalletAddress,
          }
          return item
        })
      )
      _data.walletName = items[0].name
      return _data.walletName
    },
    loadBalance: async (selectToken?: TokenInfo) => {
      // try {
      _data.selectedToken = selectToken
      await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
      const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider

      if (_data.selectedToken) {
        if ('null' !== _data.selectedToken.address) {
          //if selected token address is non-native token
          const tokenContract = new ethers.Contract(
            _data.selectedToken.address,
            PhoneLink.abi,
            provider
          )
          const data = await tokenContract.balanceOf(_data.defaultAccount)
          const pow = new BigNumber('10').pow(
            new BigNumber(_data.selectedToken.decimal)
          )
          _data.balanceToken = web3BNToFloatString(
            data,
            pow,
            0,
            BigNumber.ROUND_DOWN
          )
        } else {
          //if selected token is native token
          const balance = await provider.getBalance(_data.defaultAccount)
          const balanceInEth = ethers.utils.formatEther(balance)
          _data.balanceToken = rounded(balanceInEth)
        }
      } else {
        toast.error('Enter Valid details please!!')
      }
      // } catch (e: any) {
      //   toast.error(e.message)
      // }
      return _data.balanceToken
    },
    transfer: async (
      amount: number,
      target: string,
      directAddress: boolean = false
    ) => {
      let success = false
      if (_data.defaultAccount && _data.selectedToken && amount && target) {
        if (_data.balanceToken && Number(_data.balanceToken) > amount) {
          await window.ethereum.send('eth_requestAccounts') // opens up metamask extension and connects Web2 to Web3
          const provider = new ethers.providers.Web3Provider(window.ethereum) //create provider
          const signer = provider.getSigner() // get signer
          ethers.utils.getAddress(_data.defaultAccount) //checks if an address is valid one
          const network = await provider.getNetwork()

          const tokenContract = new ethers.Contract(
            _data.selectedToken.address,
            PhoneLink.abi,
            signer
          )
          const etherAmount = ethers.utils.parseUnits(
            amount.toString(),
            'ether'
          )
          const phoneLinkContract = new ethers.Contract(
            getConfigByChain(network.chainId)[0].phoneLinkAddress,
            PhoneLink.abi,
            signer
          )

          let targetAddress = target
          if (!directAddress) {
            //gets the addresses linked to the phone number
            const to = await phoneLinkContract.fetchWalletAddress(target)

            if (to.length === 0) {
              //means your friend has not yet linked his/her wallet
              toast.error(
                'The given phone number is not linked to any wallet.' +
                  ' Ask your friend to link his Phone'
              )
              return false
            } else {
              const items = await Promise.all(
                to.map(async (i: any) => {
                  let item = {
                    phoneNumber: i.phoneNumber,
                    connectedWalletAddress: i.connectedWalletAddress,
                  }
                  return item
                })
              )
              targetAddress = items[0].connectedWalletAddress
            }
          }

          if ('null' !== _data.selectedToken.address) {
            //for non-native coin
            const tx = await tokenContract.transfer(targetAddress, etherAmount) //transfers tokens from msg.sender to destination wallet
            tx.wait(1)
          } else {
            //for native coin
            const tx = await signer.sendTransaction({
              to: targetAddress, //destination wallet address
              value: etherAmount, // amount of native token to be sent
            })
            tx.wait(1)
          }
          toast.success('Transfer Successful.')
          return true
        } else {
          toast.error('You need more balance to execute this transaction.')
        }
      } else {
        toast.error('Please fill all the details correctly')
      }
      return success
    },
  }
}

export default PaymentHelper