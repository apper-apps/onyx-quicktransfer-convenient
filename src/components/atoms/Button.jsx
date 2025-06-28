import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon = null, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm hover:shadow-md focus:ring-emerald-500",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm hover:shadow-md focus:ring-emerald-500",
    outline: "border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white focus:ring-emerald-500",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md focus:ring-red-500"
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }
  
  const disabledClasses = "opacity-50 cursor-not-allowed pointer-events-none"
  
  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${(disabled || loading) ? disabledClasses : ''}
    ${className}
  `.trim()

  const renderIcon = (position) => {
    if (!icon || iconPosition !== position) return null
    
    if (loading && position === 'left') {
      return <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
    }
    
    return <ApperIcon name={icon} className={`w-4 h-4 ${position === 'left' ? 'mr-2' : 'ml-2'}`} />
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {renderIcon('left')}
      {children}
      {renderIcon('right')}
    </motion.button>
  )
}

export default Button