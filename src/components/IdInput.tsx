import { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import { FaBackspace, FaEdit, FaEnvelope, FaWallet } from 'react-icons/fa'
import PhoneInput from 'react-phone-number-input'
import { emailRegex, emptyString, isHexString, phoneRegex } from './utils'

type IdInputProps = {
  wrapperClass?: string
  className?: string
  id?: string
  value?: string
  placeholder?: string
  excludeIdTypes?: IdType[]
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
const isEmail = (str?: string) =>
  hasStringValue(str) && emailRegex.nonStickyTest(str)
const isPhone = (str?: string) =>
  hasStringValue(str) &&
  0 !== Number(str) &&
  ('+' === str || phoneRegex.nonStickyTest(str))
const isWallet = (str?: string) => hasStringValue(str) && isHexString(str)
const getCorrectIdType = (value: string) => {
  if (isEmail(value)) return IdType.email
  else if (isPhone(value)) return IdType.phone
  else if (isWallet(value)) return IdType.wallet
  else return defaultIdType
}

const IdInput: NextPage<IdInputProps> = ({
  children,
  className,
  id,
  value,
  wrapperClass,
  placeholder,
  excludeIdTypes = [],
  onChange,
  ...rest
}) => {
  const inputRef = useRef()
  const [idValue, setIdValue] = useState(value ?? '')
  const [idType, setIdType] = useState(getCorrectIdType(idValue))

  useEffect(() => {
    inputRef.current && (inputRef.current as HTMLElement).focus()
  }, [idType])

  // useEffect(() => {
  //   validate &&
  //     (() => {
  //       validate = !validate
  //       return true
  //     })() &&
  //     onValidate()
  // }, [validate])

  useEffect(() => onChange && onChange(idValue, idType), [idValue])

  const notExcluded = (check: IdType) => !excludeIdTypes.includes(check)
  const setIdTypeSafe = (check: IdType) =>
    notExcluded(check)
      ? idType !== check && setIdType(check)
      : idType !== defaultIdType && setIdType(defaultIdType)
  const setCorrectIdType = (value: string) =>
    setIdTypeSafe(getCorrectIdType(value))

  const onTextChange = (e?: string) => {
    const value = e?.toString() ?? ''
    let isValid = true
    switch (idType) {
      case IdType.phone:
        isValid = isPhone(value)
        break
      case IdType.wallet:
        isValid = isWallet(value)
        break
      case IdType.email:
        isValid = isEmail(value)
        break
    }
    if (!isValid) setCorrectIdType(value)
    setIdValue(value)
  }

  const onValidate = () => {
    let valid = true
    switch (idType) {
      case IdType.email:
        valid = isEmail(idValue)
        break
      case IdType.phone:
        valid = isPhone(idValue)
        break
      case IdType.wallet:
        valid = isWallet(idValue)
        break
    }
    let result = valid
      ? `Valid ${IdTypeName[idType]}`
      : `It is not a valid ${IdTypeName[idType]}`
    return { valid, result, idValue, idType }
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
