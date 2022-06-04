import { useDebugValue, useEffect, useState } from 'react'

const useDebounce = (
  callback: (...args: any[]) => any | void,
  delay: number,
  debug: false
) => {
  let [timer, setTimer] = useState(null)

  const debounce = async (...args: any[]) => {
    clearTimeout(timer)
    setTimer(setTimeout(() => callback(...args), delay))
  }

  useEffect(() => {
    return () => clearTimeout(timer)
  }, [])

  debug && useDebugValue({ callback, delay, timer })
  return debounce
}

export default useDebounce
