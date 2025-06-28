import fileData from '@/services/mockData/files.json'

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Generate random alphanumeric string
const generateSlug = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// In-memory storage (in a real app, this would be a database)
let files = [...fileData]

export const uploadFile = async (file, shareData = {}) => {
  await delay(800) // Simulate upload time
  
  try {
    // Validate file size (100MB limit)
    const MAX_SIZE = 100 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      throw new Error('File size must be less than 100MB')
    }
    
    // Generate unique slug
    let slug = generateSlug(12)
    while (files.some(f => f.slug === slug)) {
      slug = generateSlug(12)
    }
    
    // Create file record
    const newFile = {
      Id: Math.max(...files.map(f => f.Id), 0) + 1,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      slug: slug,
      uploadTimestamp: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      downloadCount: 0,
      recipientEmail: shareData.recipientEmail || null,
      message: shareData.message || null,
      filePath: `/uploads/${slug}_${file.name}` // Simulated file path
    }
    
    files.push(newFile)
    
    return { ...newFile }
  } catch (error) {
    throw new Error(error.message || 'Upload failed')
  }
}

export const getFileBySlug = async (slug) => {
  await delay(200)
  
  try {
    const file = files.find(f => f.slug === slug)
    
    if (!file) {
      throw new Error('File not found or expired')
    }
    
    // Check if file is expired
    if (new Date(file.expirationDate) < new Date()) {
      // Remove expired file
      files = files.filter(f => f.Id !== file.Id)
      throw new Error('File has expired and is no longer available')
    }
    
    return { ...file }
  } catch (error) {
    throw new Error(error.message || 'Failed to retrieve file')
  }
}

export const downloadFile = async (fileId) => {
  await delay(300)
  
  try {
    const fileIndex = files.findIndex(f => f.Id === fileId)
    
    if (fileIndex === -1) {
      throw new Error('File not found')
    }
    
    const file = files[fileIndex]
    
    // Check if file is expired
    if (new Date(file.expirationDate) < new Date()) {
      files.splice(fileIndex, 1)
      throw new Error('File has expired')
    }
    
    // Increment download count
    files[fileIndex] = {
      ...file,
      downloadCount: file.downloadCount + 1
    }
    
    // In a real app, this would initiate the actual file download
    // For now, we'll simulate it by creating a blob URL
    const blob = new Blob(['Simulated file content'], { type: file.fileType })
    const url = URL.createObjectURL(blob)
    
    // Create download link and trigger download
    const a = document.createElement('a')
    a.href = url
    a.download = file.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    return { success: true, downloadCount: files[fileIndex].downloadCount }
  } catch (error) {
    throw new Error(error.message || 'Download failed')
  }
}

export const generateShareLink = async (fileId, shareData = {}) => {
  await delay(400)
  
  try {
    const fileIndex = files.findIndex(f => f.Id === fileId)
    
    if (fileIndex === -1) {
      throw new Error('File not found')
    }
    
    const file = files[fileIndex]
    
    // Update file with share data
    files[fileIndex] = {
      ...file,
      recipientEmail: shareData.recipientEmail || file.recipientEmail,
      message: shareData.message || file.message
    }
    
    const shareUrl = `${window.location.origin}/download/${file.slug}`
    
    return {
      shareUrl,
      expirationDate: file.expirationDate,
      slug: file.slug
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to generate share link')
  }
}

export const getFileStats = async (fileId) => {
  await delay(200)
  
  try {
    const file = files.find(f => f.Id === fileId)
    
    if (!file) {
      throw new Error('File not found')
    }
    
    return {
      downloadCount: file.downloadCount,
      uploadTimestamp: file.uploadTimestamp,
      expirationDate: file.expirationDate
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to retrieve file stats')
  }
}

// Cleanup expired files (would be run as a scheduled task in production)
export const cleanupExpiredFiles = () => {
  const now = new Date()
  const initialCount = files.length
  files = files.filter(f => new Date(f.expirationDate) > now)
  const removedCount = initialCount - files.length
  return { removedCount, remainingCount: files.length }
}