import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const FilePreview = ({ file, onRemove }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file) => {
    const type = file.type.toLowerCase()
    const extension = file.name.split('.').pop().toLowerCase()
    
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

  const fileInfo = getFileIcon(file)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4"
    >
      <div className="flex items-center space-x-4">
        <div className={`file-icon ${fileInfo.color}`}>
          <ApperIcon name={fileInfo.icon} className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
        </div>
        
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default FilePreview