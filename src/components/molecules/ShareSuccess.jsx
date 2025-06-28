import { useState } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'sonner'

const ShareSuccess = ({ shareUrl, onReset }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const shareViaEmail = () => {
    const subject = 'File shared via QuickTransfer'
    const body = `I've shared a file with you using QuickTransfer.\n\nDownload link: ${shareUrl}\n\nThis link will expire in 7 days.`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-6 h-fit"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">File Ready to Share!</h2>
          <p className="text-gray-600 mt-1">Your download link has been generated</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md"
              />
              <Button
                variant="secondary"
                size="sm"
                icon={copied ? "Check" : "Copy"}
                onClick={copyToClipboard}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="primary"
              icon="Mail"
              onClick={shareViaEmail}
              className="w-full"
            >
              Share via Email
            </Button>
            <Button
              variant="secondary"
              icon="UploadCloud"
              onClick={onReset}
              className="w-full"
            >
              Upload Another File
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            This link will expire in 7 days and can be accessed without login
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default ShareSuccess