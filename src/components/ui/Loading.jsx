import { motion } from 'framer-motion'

const Loading = ({ text = "Loading...", type = "default" }) => {
  if (type === "upload") {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">{text}</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we process your file</p>
        </div>
      </div>
    )
  }

  if (type === "download") {
    return (
      <div className="card p-8 max-w-md mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full h-3 bg-gray-200 rounded"></div>
            <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
          </div>
          <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full loading-dots"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full loading-dots"></div>
          <div className="w-2 h-2 bg-emerald-500 rounded-full loading-dots"></div>
        </div>
        <span className="text-gray-600 font-medium">{text}</span>
      </div>
    </div>
  )
}

export default Loading