import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'sonner'

const FileDropzone = ({ onFileSelect, loading = false, maxSize = 100 * 1024 * 1024 }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file) => {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain', 'text/csv',
      'application/zip', 'application/x-zip-compressed',
      'video/mp4', 'video/quicktime', 'video/x-msvideo',
      'audio/mpeg', 'audio/wav', 'audio/ogg'
    ]

    const blockedExtensions = ['.php', '.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js', '.jar', '.com', '.app']
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

    if (blockedExtensions.includes(fileExtension)) {
      toast.error(`File type ${fileExtension} is not allowed for security reasons`)
      return false
    }

    if (file.size > maxSize) {
      toast.error(`File size must be less than ${formatFileSize(maxSize)}`)
      return false
    }

    if (!allowedTypes.includes(file.type) && file.type !== '') {
      toast.error('This file type is not supported')
      return false
    }

    return true
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 1) {
      toast.error('Please select only one file at a time')
      return
    }
    
    const file = files[0]
    if (file && validateFile(file)) {
      onFileSelect(file)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file && validateFile(file)) {
      onFileSelect(file)
    }
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }

  const handleClick = () => {
    if (!loading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <motion.div
      className={`
        dropzone p-12 cursor-pointer text-center
        ${isDragOver ? 'dropzone-active' : ''}
        ${loading ? 'pointer-events-none opacity-75' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={loading}
      />
      
      <div className="space-y-4">
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors duration-300 ${
          isDragOver ? 'bg-emerald-100' : 'bg-gray-100'
        }`}>
          <ApperIcon 
            name={loading ? "Loader2" : isDragOver ? "Upload" : "CloudUpload"} 
            className={`w-8 h-8 ${
              isDragOver ? 'text-emerald-600' : 'text-gray-500'
            } ${loading ? 'animate-spin' : ''}`} 
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {loading ? 'Processing...' : isDragOver ? 'Drop your file here' : 'Drop files to upload'}
          </h3>
          <p className="text-gray-600">
            {loading ? 'Please wait while we process your file' : 'or click to browse from your computer'}
          </p>
          <p className="text-sm text-gray-500">
            Maximum file size: {formatFileSize(maxSize)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default FileDropzone