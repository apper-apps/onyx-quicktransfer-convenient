import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import UploadSection from '@/components/organisms/UploadSection'
import ShareForm from '@/components/molecules/ShareForm'
import ShareSuccess from '@/components/molecules/ShareSuccess'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { generateShareLink } from '@/services/api/fileService'
import { AuthContext } from '../../App'
import { toast } from 'sonner'

const UploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [shareUrl, setShareUrl] = useState('')
  const [generating, setGenerating] = useState(false)
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)

  const handleUploadComplete = (fileData) => {
    setUploadedFile(fileData)
  }

const handleGenerateLink = async (shareData) => {
    if (!uploadedFile) return

    setGenerating(true)
    try {
      const result = await generateShareLink(uploadedFile.Id, shareData)
      setShareUrl(result.shareUrl)
      toast.success('Share link generated successfully!')
    } catch (error) {
      console.error('Generate link error:', error)
      toast.error(error.message || 'Failed to generate share link')
    } finally {
      setGenerating(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully!')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const handleReset = () => {
    setUploadedFile(null)
    setShareUrl('')
    setGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
<header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">QuickTransfer</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-600">
                  Welcome, {user.firstName || user.emailAddress}
                </span>
              )}
              <Button
                variant="secondary"
                size="sm"
                icon="LogOut"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Panel - Upload */}
          <div className="space-y-6">
            <UploadSection onUploadComplete={handleUploadComplete} />
          </div>

          {/* Right Panel - Share */}
          <div className="space-y-6">
            {!uploadedFile ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-8 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📤</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload a file to get started
                </h3>
                <p className="text-gray-600">
                  Once your file is uploaded, you'll be able to generate a secure sharing link
                </p>
              </motion.div>
            ) : shareUrl ? (
              <ShareSuccess 
                shareUrl={shareUrl} 
                onReset={handleReset}
              />
            ) : (
              <ShareForm 
                onGenerateLink={handleGenerateLink}
                loading={generating}
                disabled={!uploadedFile}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 QuickTransfer. Simple, secure file sharing.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default UploadPage