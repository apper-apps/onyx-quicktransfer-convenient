import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { getFileBySlug, downloadFile } from '@/services/api/fileService'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

const DownloadPage = () => {
  const { slug } = useParams()
  const [fileData, setFileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadFileData()
  }, [slug])

  const loadFileData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getFileBySlug(slug)
      setFileData(data)
    } catch (err) {
      setError(err.message || 'File not found or expired')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!fileData) return

    setDownloading(true)
    try {
      await downloadFile(fileData.Id)
      toast.success('Download started successfully!')
    } catch (err) {
      toast.error(err.message || 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileType, fileName) => {
    const type = fileType?.toLowerCase() || ''
    const extension = fileName?.split('.').pop()?.toLowerCase() || ''
    
    if (type.startsWith('image/')) return { icon: 'Image', color: 'bg-purple-500' }
    if (type === 'application/pdf') return { icon: 'FileText', color: 'bg-red-500' }
    if (type.includes('word') || extension === 'doc' || extension === 'docx') return { icon: 'FileText', color: 'bg-blue-500' }
    if (type.includes('excel') || extension === 'xls' || extension === 'xlsx') return { icon: 'Sheet', color: 'bg-green-500' }
    if (type.includes('powerpoint') || extension === 'ppt' || extension === 'pptx') return { icon: 'Presentation', color: 'bg-orange-500' }
    if (type.startsWith('video/')) return { icon: 'Video', color: 'bg-pink-500' }
    if (type.startsWith('audio/')) return { icon: 'Music', color: 'bg-indigo-500' }
    if (type.includes('zip') || extension === 'zip' || extension === 'rar') return { icon: 'Archive', color: 'bg-yellow-500' }
    
    return { icon: 'File', color: 'bg-gray-500' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loading type="download" text="Loading file information..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">QuickTransfer</h1>
            </div>
          </div>
        </header>
        
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Error 
            title="File Not Found"
            message={error}
            type="download"
            onRetry={loadFileData}
          />
        </main>
      </div>
    )
  }

  const fileInfo = getFileIcon(fileData.fileType, fileData.fileName)
  const expiresIn = formatDistanceToNow(new Date(fileData.expirationDate), { addSuffix: true })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">QuickTransfer</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 text-center space-y-6"
        >
          {/* File Icon */}
          <div className={`file-icon ${fileInfo.color} w-20 h-20 mx-auto`}>
            <ApperIcon name={fileInfo.icon} className="w-10 h-10" />
          </div>

          {/* File Info */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">{fileData.fileName}</h1>
            <p className="text-lg text-gray-600">{formatFileSize(fileData.fileSize)}</p>
          </div>

          {/* Download Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{fileData.downloadCount}</p>
              <p className="text-sm text-gray-500">Downloads</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">Expires {expiresIn}</p>
              <p className="text-xs text-gray-500">7-day limit</p>
            </div>
          </div>

          {/* Download Button */}
          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              icon="Download"
              loading={downloading}
              onClick={handleDownload}
              className="w-full sm:w-auto min-w-[200px]"
            >
              {downloading ? 'Preparing Download...' : 'Download File'}
            </Button>
          </div>

          {/* Security Message */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ApperIcon name="Shield" className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div className="text-left">
                <h3 className="font-medium text-emerald-900">Secure Download</h3>
                <p className="text-sm text-emerald-700 mt-1">
                  This file has been scanned for security and will be automatically deleted after 7 days.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-500">
              Powered by QuickTransfer - Simple, secure file sharing
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default DownloadPage