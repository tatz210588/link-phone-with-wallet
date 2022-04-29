import { NextPage } from 'next'

type ContainerProps = {
  wrapperClass?: string
  containerClass?: string
  contentWrapperClass?: string
}

const Container: NextPage<ContainerProps> = ({
  children,
  wrapperClass = 'wrapper',
  containerClass = 'container',
  contentWrapperClass = 'content-wrapper',
}) => {
  return (
    <>
      <div className={wrapperClass}>
        <div className={containerClass}>
          <div className={contentWrapperClass}>{children}</div>
        </div>
      </div>
    </>
  )
}

export default Container
