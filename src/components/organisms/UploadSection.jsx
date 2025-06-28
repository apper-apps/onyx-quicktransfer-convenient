import { useState } from 'react'
import { motion } from 'framer-motion'
import FileDropzone from '@/components/molecules/FileDropzone'
import FilePreview from '@/components/molecules/FilePreview'
import ProgressBar from '@/components/atoms/ProgressBar'
import { uploadFile } from '@/services/api/fileService'
import { toast } from 'sonner'

const UploadSection = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (file) => {
    setSelectedFile(file)
    setUploading(true)
    setUploadProgress(0)

try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 200)

      const result = await uploadFile(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      setTimeout(() => {
        onUploadComplete(result)
        toast.success('File uploaded successfully!')
      }, 500)
      
    } catch (error) {
      console.error('Upload error:', error)
      setUploadProgress(0)
      setUploading(false)
      setSelectedFile(null)
      toast.error(error.message || 'Upload failed. Please try again.')
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    setUploading(false)
  }

  if (uploading && selectedFile) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 space-y-6"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Uploading File...</h3>
          <p className="text-gray-600">Please wait while we process your file</p>
        </div>
        
        <FilePreview file={selectedFile} />
        
        <ProgressBar 
          progress={uploadProgress} 
          showPercentage={true}
          size="lg"
        />
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Do not close this window during upload
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Share Files Instantly
        </h1>
        <p className="text-gray-600 text-lg">
          Upload up to 100MB and generate secure download links
        </p>
      </div>

      <FileDropzone 
        onFileSelect={handleFileSelect}
        loading={uploading}
      />

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          Supported formats: Images, Documents, Videos, Audio, Archives
        </p>
        <p className="text-xs text-gray-400">
          Files are automatically deleted after 7 days
        </p>
      </div>
    </motion.div>
  )
}

export default UploadSection