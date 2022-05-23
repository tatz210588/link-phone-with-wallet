import { NextPage } from 'next'
import { IconType } from 'react-icons'

type InputIconProps = {
  Icon: IconType
  className?: string
  iconClass?: string
}

const InputIcon: NextPage<InputIconProps> = ({
  children,
  Icon,
  className,
  iconClass,
}) => {
  return (
    <>
      <span className={className}>
        <Icon className={iconClass} />
      </span>
      {children}
    </>
  )
}

export default InputIcon
