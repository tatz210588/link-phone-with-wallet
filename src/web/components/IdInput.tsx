import PhoneInput from 'react-phone-number-input'
import { NextPage } from 'next'
import { ChangeEvent, useEffect, useState } from 'react'

type IdInputProps = {
  wrapperClass?: string
  className?: string
  id: string
  onChange?: (value: string) => void
  placeholder?: string
}

enum IdType {
  phone,
  email,
}

const IdInput: NextPage<IdInputProps> = ({
  children,
  className,
  id,
  wrapperClass,
  onChange,
  placeholder,
  ...rest
}) => {
  const [idType, setIdType] = useState(IdType.email)
  const [idValue, setIdValue] = useState('')

  useEffect(() => {
    document.getElementById(id)?.focus()
  }, [idType])

  useEffect(() => onChange && onChange(idValue), [idValue])

  const isNumeric = (str: string) => !isNaN(Number(str))

  const onTextChange = (e?: string) => {
    const value = e ? e.toString() : ''
    switch (idType) {
      case IdType.email:
        if (value && isNumeric(value)) setIdType(IdType.phone)
        break
      case IdType.phone:
        if (value === '') setIdType(IdType.email)
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
            id={id}
            className={className}
            value={idValue}
            onChange={onInputChange}
            placeholder={placeholder}
          />
        )}
        {idType === IdType.phone && (
          <PhoneInput
            id={id}
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
