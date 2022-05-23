import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import {
  FaBackspace,
  FaCheckCircle,
  FaEdit,
  FaEnvelope,
  FaWallet,
} from 'react-icons/fa'
import PhoneInput from 'react-phone-number-input'
import useDebounce from '../hooks/useDebounce'
import { isEmailString, isHexString, isPhoneString } from './utils'

type IdInputProps = {
  wrapperClass?: string
  className?: string
  id?: string
  value?: string
  placeholder?: string
  excludeIdTypes?: IdType[]
  delay?: number
  onChange?: (value: string, inputType: IdType) => void
  changeValid?: any
}

export enum IdType {
  email = 'email',
  phone = 'phone',
  wallet = 'wallet',
}

export const IdTypeName = {
  [IdType.email]: 'Email',
  [IdType.phone]: 'Phone number',
  [IdType.wallet]: 'Wallet address',
}

const defaultIdType = IdType.email
export const isEmail = (str?: string, strict = false) =>
  isEmailString(str, strict)
export const isPhone = (str?: string, strict = false) =>
  isPhoneString(str, strict)
export const isWallet = (str?: string, strict = false) =>
  isHexString(str, strict)

const getCorrectIdType = (value: string, strict = false) => {
  if (isEmail(value, strict)) return IdType.email
  else if (isPhone(value, strict)) return IdType.phone
  else if (isWallet(value, strict)) return IdType.wallet
  else return defaultIdType
}

export const IdInputValidate = (
  value: string,
  inputType: IdType,
  strict = false
) => {
  let valid = true
  switch (inputType) {
    case IdType.email:
      valid = isEmail(value, strict)
      break
    case IdType.phone:
      valid = isPhone(value, strict)
      break
    case IdType.wallet:
      valid = isWallet(value, strict)
      break
  }
  let result = valid
    ? `It ${strict ? 'is' : '(maybe)'} a Valid ${IdTypeName[inputType]}`
    : `It ${strict ? 'is' : '(maybe)'} an Invalid ${IdTypeName[inputType]}`
  return { valid, result, value, inputType, strict }
}

const IdInput: NextPage<IdInputProps> = ({
  children,
  className,
  id,
  value,
  wrapperClass,
  placeholder,
  excludeIdTypes = [],
  delay = 0,
  onChange,
  changeValid,
  ...rest
}) => {
  const inputRef = useRef()
  const [idValue, setIdValue] = useState(value ?? '')
  const [idType, setIdType] = useState(getCorrectIdType(idValue))
  const delayedOnChange =
    delay && onChange ? useDebounce(onChange, delay) : null

  useEffect(() => {
    inputRef.current && (inputRef.current as HTMLElement).focus()
  }, [idType])

  // useEffect(() => {
  //   validate &&
  //     (() => {
  //       validate = !validate
  //       return true
  //     })() &&
  //     IdInputValidate()
  // }, [validate])

  useEffect(() => {
    onTypeCheck()
    console.log("check", onTypeCheck())
    changeValid(onTypeCheck())
    if (delayedOnChange) delayedOnChange(idValue, idType)
    else onChange && onChange(idValue, idType)
  }, [idValue])

  const notExcluded = (check: IdType) => !excludeIdTypes.includes(check)
  const setIdTypeSafe = (check: IdType) =>
    notExcluded(check)
      ? idType !== check && setIdType(check)
      : idType !== defaultIdType && setIdType(defaultIdType)
  const setCorrectIdType = () => setIdTypeSafe(getCorrectIdType(idValue))

  const onTypeCheck = () =>
    !IdInputValidate(idValue, idType).valid && setCorrectIdType()

  const onTextChange = (e?: string) => {
    const value = e?.toString() ?? ''
    setIdValue(value)
  }

  const renderInputIcon = (curIdType: IdType) => {
    switch (curIdType) {
      case IdType.email:
        return (
          <>
            {isEmail(idValue) ? (
              <FaEnvelope className="input-icon" />
            ) : (
              <FaEdit className="input-icon" />
            )}
          </>
        )
      case IdType.wallet:
        return <FaWallet className="input-icon" />
    }
  }
  const renderInput = () => {
    let curIdType = notExcluded(idType) ? idType : defaultIdType
    switch (curIdType) {
      case IdType.email:
      case IdType.wallet:
        return (
          <>
            <span>{renderInputIcon(curIdType)}</span>
            <input
              ref={inputRef}
              id={id}
              className={className}
              value={idValue}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={placeholder}
            />
          </>
        )
      case IdType.phone:
        return (
          <PhoneInput
            ref={inputRef}
            id={id}
            className={className}
            value={idValue}
            onChange={onTextChange}
            placeholder={placeholder}
          />
        )
    }
  }

  return (
    <>
      <div className={wrapperClass}>
        {renderInput()}
        <button type="button" onClick={(_) => onTextChange('')}>
          <FaBackspace className="input-icon" />
        </button>
        {children}
      </div>
    </>
  )
}

export default IdInput
