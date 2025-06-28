import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import TextArea from '@/components/atoms/TextArea'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ShareForm = ({ onGenerateLink, loading = false, disabled = false }) => {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onGenerateLink(formData)
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="card p-6 h-fit"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Share2" className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Share Your File</h2>
          <p className="text-gray-600 mt-1">Generate a secure download link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Recipient Email (Optional)"
            type="email"
            placeholder="recipient@example.com"
            value={formData.recipientEmail}
            onChange={handleChange('recipientEmail')}
            icon="Mail"
            disabled={disabled}
          />

          <TextArea
            label="Message (Optional)"
            placeholder="Add a personal message..."
            value={formData.message}
            onChange={handleChange('message')}
            rows={3}
            disabled={disabled}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon="Link"
              loading={loading}
              disabled={disabled}
              className="w-full"
            >
              Generate Share Link
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Links expire after 7 days for security
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default ShareForm