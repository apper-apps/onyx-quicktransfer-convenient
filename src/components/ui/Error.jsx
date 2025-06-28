import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  title = "Something went wrong", 
  message = "An error occurred while processing your request.", 
  onRetry = null,
  type = "default"
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case 'upload':
        return 'UploadX'
      case 'download':
        return 'DownloadX'
      case 'file':
        return 'FileX'
      default:
        return 'AlertCircle'
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center space-y-4"
    >
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <ApperIcon name={getErrorIcon()} className="w-8 h-8 text-red-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </motion.div>
  )
}

export default Error