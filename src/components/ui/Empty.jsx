import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No files found", 
  message = "Start by uploading your first file.", 
  actionText = "Upload File",
  onAction = null,
  icon = "Upload"
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center space-y-6"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} className="w-10 h-10 text-emerald-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name={icon} className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </motion.div>
  )
}

export default Empty