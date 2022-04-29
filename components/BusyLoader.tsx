import { NextPage } from 'next'
import { BeatLoader, CircleLoader, RingLoader } from 'react-spinners'
import { LoaderSizeProps } from 'react-spinners/interfaces'

const defaultClass = 'busy-container'

export enum LoaderType {
  Beat,
  Circle,
  Ring,
}

export interface BusyContainerProps extends LoaderSizeProps {
  loaderType: LoaderType
  wrapperClass?: string
  className?: string
}
const BusyLoader: NextPage<BusyContainerProps> = ({
  children,
  loaderType,
  wrapperClass,
  className,
  ...rest
}) => {
  const loaderProps = { className: className ?? defaultClass, ...rest }
  const chooseLoader = (choice: LoaderType) => {
    switch (choice) {
      case LoaderType.Beat:
        return <BeatLoader {...loaderProps} />
      case LoaderType.Circle:
        return <CircleLoader {...loaderProps} />
      case LoaderType.Ring:
        return <RingLoader {...loaderProps} />
    }
  }
  return (
    <>
      <div className={wrapperClass ?? defaultClass}>
        {chooseLoader(loaderType)}
        <p>{children}</p>
      </div>
    </>
  )
}

export default BusyLoader
