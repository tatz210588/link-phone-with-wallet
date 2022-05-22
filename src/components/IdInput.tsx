import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { FaBackspace, FaEdit, FaEnvelope, FaWallet } from 'react-icons/fa'
import PhoneInput from 'react-phone-number-input'
import useDebounce from '../hooks/useDebounce'
import { emailRegex, emptyString, isHexString, phoneRegex } from './utils'

type IdInputProps = {
  wrapperClass?: string
  className?: string
  id?: string
  value?: string
  placeholder?: string
  excludeIdTypes?: IdType[]
  delay?: number
  onChange?: (value: string, inputType: IdType) => void
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
const hasStringValue = (str?: string) => str && !emptyString(str)
export const isEmail = (str?: string) =>
  hasStringValue(str) && emailRegex.nonStickyTest(str)
export const isPhone = (str?: string) =>
  hasStringValue(str) &&
  0 !== Number(str) &&
  ('+' === str || phoneRegex.nonStickyTest(str))
export const isWallet = (str?: string) =>
  hasStringValue(str) && isHexString(str)

const getCorrectIdType = (value: string) => {
  if (isEmail(value)) return IdType.email
  else if (isPhone(value)) return IdType.phone
  else if (isWallet(value)) return IdType.wallet
  else return defaultIdType
}

export const IdInputValidate = (value: string, inputType: IdType) => {
  let valid = true
  switch (inputType) {
    case IdType.email:
      valid = isEmail(value)
      break
    case IdType.phone:
      valid = isPhone(value)
      break
    case IdType.wallet:
      valid = isWallet(value)
      break
  }
  let result = valid
    ? `Valid ${IdTypeName[inputType]}`
    : `It is not a valid ${IdTypeName[inputType]}`
  return { valid, result, value, inputType }
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
    onTypeCheck(idValue)
    if (delayedOnChange) delayedOnChange(idValue, idType)
    else onChange && onChange(idValue, idType)
  }, [idValue])

  const notExcluded = (check: IdType) => !excludeIdTypes.includes(check)
  const setIdTypeSafe = (check: IdType) =>
    notExcluded(check)
      ? idType !== check && setIdType(check)
      : idType !== defaultIdType && setIdType(defaultIdType)
  const setCorrectIdType = (value: string) =>
    setIdTypeSafe(getCorrectIdType(value))

  const onTypeCheck = (value: string) =>
    !IdInputValidate(value, idType).valid && setCorrectIdType(value)

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
            {renderInputIcon(curIdType)}
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
