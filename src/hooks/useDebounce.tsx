import {
  useCallback,
  // useDebugValue,
  useEffect,
  useState,
} from 'react'

const useDebounce = (callback, delay: number) => {
  let [timer, setTimer] = useState(null)
  const cb = useCallback(callback, [])

  const debounce = async (...args) => {
    clearTimeout(timer)
    setTimer(setTimeout(() => cb(...args), delay))
  }

  useEffect(() => {
    return () => clearTimeout(timer)
  }, [])

  // useDebugValue({ cb, timer, delay })
  return debounce
}

export default useDebounce
