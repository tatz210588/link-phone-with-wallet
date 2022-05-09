import { NextPage } from 'next'
import { ChangeEvent, useEffect, useState } from 'react'
import { FaBackspace } from 'react-icons/fa'
import PhoneInput from 'react-phone-number-input'
import {
  emptyString,
  isHexString,
  isNumeric,
  phoneRegex,
  randomString,
} from './utils'

type IdInputProps = {
  wrapperClass?: string
  className?: string
  id?: string
  value?: string
  onChange?: (value: string, inputType: IdType) => void
  placeholder?: string
  excludeIdTypes?: IdType[]
}

export enum IdType {
  email = 'email',
  phone = 'phone',
  wallet = 'wallet',
}

const defaultIdType = IdType.email
const isPhone = (str?: string) =>
  str &&
  !emptyString(str) &&
  0 !== Number(str) &&
  ('+' === str || phoneRegex.nonStickyTest(str))
const isWallet = (str?: string) => isHexString(str)

const IdInput: NextPage<IdInputProps> = ({
  children,
  className,
  id,
  value,
  wrapperClass,
  onChange,
  placeholder,
  excludeIdTypes = [],
  ...rest
}) => {
  const [elId, setElId] = useState(id)
  const [idValue, setIdValue] = useState(value ?? '')
  const [idType, setIdType] = useState(
    isPhone(idValue) ? IdType.phone : defaultIdType
  )
  const [excludeTypes, setExcludeTypes] = useState(excludeIdTypes)

  useEffect(() => {
    if (emptyString(elId)) {
      let _id = ''
      do {
        _id = randomString()
      } while (document.getElementById(_id))
      setElId(_id)
    }
  }, [elId])

  useEffect(() => {
    elId && document.getElementById(elId)?.focus()
  }, [idType])

  useEffect(() => onChange && onChange(idValue, idType), [idValue])

  const notExcluded = (check: IdType) => !excludeTypes.includes(check)
  const isIdType = (check: IdType) => idType === check && notExcluded(check)
  const setIdTypeSafe = (check: IdType) =>
    notExcluded(check) && setIdType(check)

  const onTextChange = (e?: string) => {
    const value = e?.toString() ?? ''
    switch (idType) {
      case IdType.phone:
      case IdType.wallet:
        if (emptyString(value) || !isNumeric(value)) setIdType(defaultIdType)
        break
      case IdType.email:
      default:
        if (isWallet(value)) setIdTypeSafe(IdType.wallet)
        else if (isPhone(value)) setIdTypeSafe(IdType.phone)
        break
    }
    setIdValue(value)
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onTextChange(e.target.value)
  }

  return (
    <>
      <div className={wrapperClass}>
        {isIdType(IdType.email) && (
          <input
            id={elId}
            className={className}
            value={idValue}
            onChange={onInputChange}
            placeholder={placeholder}
          />
        )}
        {isIdType(IdType.phone) && (
          <PhoneInput
            id={elId}
            className={className}
            value={idValue}
            onChange={onTextChange}
            placeholder={placeholder}
          />
        )}
        {isIdType(IdType.wallet) && (
          <input
            id={elId}
            className={`${className} text-center`}
            value={idValue}
            onChange={onInputChange}
            placeholder={placeholder}
          />
        )}
        <button
          type="button"
          className="mx-2 text-amber-200"
          onClick={(_) => onTextChange('')}
        >
          <FaBackspace className="h-6 w-6" />
        </button>
        {children}
      </div>
    </>
  )
}

export default IdInput
