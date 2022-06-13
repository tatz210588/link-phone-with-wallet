import { useEffect, useState } from 'react'

const useDebounce = (
  callback: (...args: any[]) => any | void | Promise<any>,
  delay: number,
  debug = false
) => {
  let [timer, setTimer] = useState(null)

  const debounce = async (...args: any[]) => {
    clearTimeout(timer)
    setTimer(
      setTimeout(() => {
        callback(...args)
        debug && console.info({ args, callback, delay, timer })
      }, delay)
    )
  }

  useEffect(() => {
    return () => clearTimeout(timer)
  }, [])

  return debounce
}

export default useDebounce
