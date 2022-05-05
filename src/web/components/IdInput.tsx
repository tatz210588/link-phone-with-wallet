import { NextPage } from 'next'
import { ChangeEvent, useEffect, useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import { emptyString, isNumeric, randomString } from './utils'

type IdInputProps = {
  wrapperClass?: string
  className?: string
  id?: string
  value?: string
  onChange?: (value: string, inputType?: IdType) => void
  placeholder?: string
}

enum IdType {
  phone,
  email,
}

const defaultIdType = IdType.email
const isPhone = (str?: string) => str && !emptyString(str) && isNumeric(str)

const IdInput: NextPage<IdInputProps> = ({
  children,
  className,
  id,
  value,
  wrapperClass,
  onChange,
  placeholder,
  ...rest
}) => {
  const [elId, setElId] = useState(id)
  const [idValue, setIdValue] = useState(value ?? '')
  const [idType, setIdType] = useState(
    isPhone(idValue) ? IdType.phone : defaultIdType
  )

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

  const onTextChange = (e?: string) => {
    const value = e ? e.toString() : ''
    switch (idType) {
      case IdType.phone:
        if (emptyString(value)) setIdType(defaultIdType)
        break
      case IdType.email:
      default:
        if (isPhone(value)) setIdType(IdType.phone)
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
        {idType === IdType.email && (
          <input
            id={elId}
            className={className}
            value={idValue}
            onChange={onInputChange}
            placeholder={placeholder}
          />
        )}
        {idType === IdType.phone && (
          <PhoneInput
            id={elId}
            className={className}
            value={idValue}
            onChange={onTextChange}
            placeholder={placeholder}
          />
        )}
        {children}
      </div>
    </>
  )
}

export default IdInput
