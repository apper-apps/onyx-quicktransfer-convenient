import { useState, useCallback } from 'react'
import { copyToClipboard } from '@/utils/fileHelpers'
import { toast } from 'sonner'

export const useClipboard = () => {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text) => {
    try {
      const success = await copyToClipboard(text)
      
      if (success) {
        setCopied(true)
        toast.success('Copied to clipboard!')
        
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000)
        
        return true
      } else {
        throw new Error('Copy failed')
      }
    } catch (error) {
      toast.error('Failed to copy to clipboard')
      return false
    }
  }, [])

  return { copied, copy }
}