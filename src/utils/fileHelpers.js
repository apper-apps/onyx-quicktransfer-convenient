// File size formatting utility
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// File type detection and icon mapping
export const getFileTypeInfo = (file) => {
  const type = file.type?.toLowerCase() || ''
  const extension = file.name?.split('.').pop()?.toLowerCase() || ''
  
  // Image files
  if (type.startsWith('image/')) {
    return {
      category: 'image',
      icon: 'Image',
      color: 'bg-purple-500',
      description: 'Image'
    }
  }
  
  // PDF files
  if (type === 'application/pdf') {
    return {
      category: 'document',
      icon: 'FileText',
      color: 'bg-red-500',
      description: 'PDF Document'
    }
  }
  
  // Word documents
  if (type.includes('word') || ['doc', 'docx'].includes(extension)) {
    return {
      category: 'document',
      icon: 'FileText',
      color: 'bg-blue-500',
      description: 'Word Document'
    }
  }
  
  // Excel spreadsheets
  if (type.includes('excel') || type.includes('spreadsheet') || ['xls', 'xlsx'].includes(extension)) {
    return {
      category: 'spreadsheet',
      icon: 'Sheet',
      color: 'bg-green-500',
      description: 'Spreadsheet'
    }
  }
  
  // PowerPoint presentations
  if (type.includes('powerpoint') || type.includes('presentation') || ['ppt', 'pptx'].includes(extension)) {
    return {
      category: 'presentation',
      icon: 'Presentation',
      color: 'bg-orange-500',
      description: 'Presentation'
    }
  }
  
  // Video files
  if (type.startsWith('video/')) {
    return {
      category: 'video',
      icon: 'Video',
      color: 'bg-pink-500',
      description: 'Video'
    }
  }
  
  // Audio files
  if (type.startsWith('audio/')) {
    return {
      category: 'audio',
      icon: 'Music',
      color: 'bg-indigo-500',
      description: 'Audio'
    }
  }
  
  // Archive files
  if (type.includes('zip') || type.includes('rar') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return {
      category: 'archive',
      icon: 'Archive',
      color: 'bg-yellow-500',
      description: 'Archive'
    }
  }
  
  // Text files
  if (type.startsWith('text/') || ['txt', 'csv', 'json', 'xml'].includes(extension)) {
    return {
      category: 'text',
      icon: 'FileText',
      color: 'bg-gray-500',
      description: 'Text File'
    }
  }
  
  // Default fallback
  return {
    category: 'file',
    icon: 'File',
    color: 'bg-gray-500',
    description: 'File'
  }
}

// File validation utilities
export const validateFileSize = (file, maxSize = 100 * 1024 * 1024) => {
  return file.size <= maxSize
}

export const validateFileType = (file) => {
  const allowedTypes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text
    'text/plain', 'text/csv', 'application/json',
    // Archives
    'application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed',
    // Media
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'
  ]

  const blockedExtensions = [
    '.php', '.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', 
    '.js', '.jar', '.com', '.app', '.msi', '.dmg'
  ]

  const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
  
  // Check for blocked extensions
  if (blockedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: `File type ${fileExtension} is not allowed for security reasons`
    }
  }
  
  // Check allowed MIME types (allow empty MIME type for some files)
  if (file.type && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'This file type is not supported'
    }
  }
  
  return { valid: true }
}

// Generate secure random slug
export const generateSecureSlug = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  // Use crypto.getRandomValues for better randomness if available
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length)
    window.crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
  } else {
    // Fallback to Math.random
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  }
  
  return result
}

// Date formatting utilities
export const formatUploadDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getTimeUntilExpiry = (expirationDate) => {
  const now = new Date()
  const expiry = new Date(expirationDate)
  const diffInHours = Math.max(0, Math.floor((expiry - now) / (1000 * 60 * 60)))
  
  if (diffInHours < 1) {
    return 'Expires soon'
  } else if (diffInHours < 24) {
    return `${diffInHours} hours left`
  } else {
    const days = Math.floor(diffInHours / 24)
    return `${days} day${days === 1 ? '' : 's'} left`
  }
}

// URL validation and generation
export const isValidUrl = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export const generateShareUrl = (slug, baseUrl = window.location.origin) => {
  return `${baseUrl}/download/${slug}`
}

// Copy to clipboard utility
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'absolute'
      textArea.style.left = '-999999px'
      document.body.prepend(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
      return true
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}