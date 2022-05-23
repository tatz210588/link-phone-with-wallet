import React, { useState, useEffect } from 'react'
import { TokenInfo } from '../assets/tokenConfig'
import { useWeb3 } from '@3rdweb/hooks'
import 'react-phone-number-input/style.css'
import toast from 'react-hot-toast'
import Container from '../components/Container'
import BusyLoader, { LoaderType } from '../components/BusyLoader'
import PaymentHelper from '../components/PaymentHelper'
import IdInput, {
  IdInputValidate,
  IdType,
  IdTypeName,
} from '../components/IdInput'
import { FaBackspace, FaMoneyBillWave } from 'react-icons/fa'

const style = {
  center: ` h-screen relative justify-center flex-wrap items-center `,
  searchBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#757199]`,
  searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
  copyContainer: `w-1/2`,
  title: `relative text-white text-[46px] font-semibold`,
  description: `text-[#fff] container-[400px] text-md mb-[2.5rem]`,
  spinner: `w-full h-screen flex justify-center text-white mt-20 p-100 object-center`,
  nftButton: `font-bold w-full mt-4 bg-pink-500 text-white text-lg rounded p-4 shadow-lg hover:bg-[#19a857] cursor-pointer`,
  dropDown: `font-bold w-full mt-4 bg-[#2181e2] text-white text-lg rounded p-4 shadow-lg cursor-pointer`,
}

const defaults = {
  balanceToken: '0',
}

const Pay = () => {
  const { chainId } = useWeb3()
  const [paymentHelper, setPaymentHelper] = useState(PaymentHelper())
  const [balanceToken, setBalanceToken] = useState(defaults.balanceToken)
  const [formInput, updateFormInput] = useState({
    targetId: '',
    targetIdType: IdType.phone,
    amount: 0.0,
  })
  const [loadingState, setLoadingState] = useState(false)
  const [defaultAccount, setDefaultAccount] = useState<any>(null)
  const [availableTokens, setAvailableTokens] = useState<TokenInfo[]>([])

  useEffect(() => {
    setLoadingState(true)
    paymentHelper.initialize().then((_) => setLoadingState(false))
  }, [defaultAccount])

  useEffect(() => {
    paymentHelper.connectWallet(chainId)
    setAvailableTokens(paymentHelper.data().availableTokens)
  }, [chainId])

  async function loadBalance(selectToken?: TokenInfo) {
    if (selectToken) {
      setLoadingState(true)
      setBalanceToken(
        (await paymentHelper.loadBalance(selectToken)) ?? defaults.balanceToken
      )
      setLoadingState(false)
    } else {
      setBalanceToken(defaults.balanceToken)
    }
  }

  const validate = () => {
    const validationResult = IdInputValidate(
      formInput.targetId,
      formInput.targetIdType,
      true
    )
    if (validationResult.valid && formInput.amount) {
      return true
    } else if (validationResult.valid) {
      toast.error(`Amount entered is invalid.`)
    } else {
      toast.error(
        `Entered ${IdTypeName[validationResult.inputType]} is invalid.`
      )
    }
    return false
  }

  async function transfer() {
    if (validate()) {
      setLoadingState(true)
      await paymentHelper.transfer(formInput.amount, formInput.targetId)
      await loadBalance(paymentHelper.data().selectedToken)
      setLoadingState(false)
    }
  }

  return (
    <Container>
      {!chainId ? (
        <BusyLoader loaderType={LoaderType.Ring} color={'#ffffff'} size={50}>
          <b>Click on the Connect Wallet button !!</b>
        </BusyLoader>
      ) : (
        <div className={style.copyContainer}>
          <div className={`${style.title} mt-1 p-1`}>
            Transfer Currency to Phone !!
          </div>
          <div className=" mt-4 grid grid-cols-2 gap-2">
            <select
              className={style.dropDown}
              onChange={async (e) => {
                const selectedValue = Number(e.target.value)
                let token: TokenInfo | undefined
                if (selectedValue) {
                  token = availableTokens[Number(selectedValue)]
                }
                await loadBalance(token)
              }}
            >
              {availableTokens.map((token: TokenInfo, index: number) => (
                <option value={index} key={token.address}>
                  {token.name}
                </option>
              ))}
            </select>
            <div className={style.description}>
              Available Balance: {balanceToken}
            </div>
          </div>
          <div className=" mt-4 grid grid-cols-2 gap-1">
            <IdInput
              className={style.searchInput}
              wrapperClass={`${style.searchBar} mt-2 p-1`}
              placeholder="Enter phone / email / wallet"
              value={formInput.targetId}
              id="myNewInput"
              delay={500}
              onChange={(val, idType) =>
                updateFormInput((formInput) => ({
                  ...formInput,
                  targetId: val,
                  targetIdType: idType,
                }))
              }
            />
            <div className={`${style.searchBar} mt-2 p-1`}>
              <span>
                <FaMoneyBillWave className="input-icon" />
              </span>
              <input
                type="number"
                className={style.searchInput}
                placeholder="Amount to transfer"
                value={formInput.amount}
                onChange={(e) =>
                  updateFormInput((formInput) => ({
                    ...formInput,
                    amount: Number(e.target.value),
                  }))
                }
              />
              <button
                type="button"
                onClick={(_) =>
                  updateFormInput((formInput) => ({
                    ...formInput,
                    amount: 0.0,
                  }))
                }
              >
                <FaBackspace className="input-icon" />
              </button>
            </div>
          </div>

          {loadingState === true ? (
            <BusyLoader
              loaderType={LoaderType.Beat}
              wrapperClass="white-busy-container"
              className="white-busy-container"
              color={'#ffffff'}
              size={15}
            >
              Connecting to blockchain. Please wait
            </BusyLoader>
          ) : (
            <div>
              {
                <div>
                  <button
                    onClick={() => transfer()}
                    className={style.nftButton}
                  >
                    Transfer
                  </button>
                </div>
              }
            </div>
          )}
        </div>
      )}
    </Container>
  )
}

export default Pay
