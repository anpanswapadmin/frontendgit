import { useState, useCallback, useEffect } from 'react'
import copy from 'copy-to-clipboard'

export default function useCopyClipboard(timeout = 500) {
  const [isCopied, setIsCopied] = useState(false)

  const staticCopy = useCallback((text) => {
    const didCopy = copy(text)
    setIsCopied(didCopy)
  }, [])
  /* eslint-disable consistent-return */
  useEffect(() => {
    if (isCopied) {
      const hide = setTimeout(() => {
        setIsCopied(false)
      }, timeout)

      return () => {
        clearTimeout(hide)
      }
    }
  }, [isCopied, setIsCopied, timeout])

  return [isCopied, staticCopy] as const
}
