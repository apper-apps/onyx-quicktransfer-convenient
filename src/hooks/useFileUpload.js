import { useState, useCallback } from 'react'
import { uploadFile } from '@/services/api/fileService'
import { validateFileSize, validateFileType } from '@/utils/fileHelpers'
import { toast } from 'sonner'

export const useFileUpload = () => {
  const [uploadState, setUploadState] = useState({
    file: null,
    progress: 0,
    uploading: false,
    completed: false,
    error: null,
    uploadedFileData: null
  })

  const resetUpload = useCallback(() => {
    setUploadState({
      file: null,
      progress: 0,
      uploading: false,
      completed: false,
      error: null,
      uploadedFileData: null
    })
  }, [])

  const validateFile = useCallback((file) => {
    // Check file size (100MB limit)
    if (!validateFileSize(file, 100 * 1024 * 1024)) {
      throw new Error('File size must be less than 100MB')
    }

    // Check file type
    const typeValidation = validateFileType(file)
    if (!typeValidation.valid) {
      throw new Error(typeValidation.error)
    }

    return true
  }, [])

  const startUpload = useCallback(async (file, shareData = {}) => {
    try {
      // Validate file first
      validateFile(file)

      setUploadState(prev => ({
        ...prev,
        file,
        uploading: true,
        progress: 0,
        error: null,
        completed: false
      }))

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          if (prev.progress >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return {
            ...prev,
            progress: Math.min(90, prev.progress + Math.random() * 15)
          }
        })
      }, 200)

      // Upload file
      const result = await uploadFile(file, shareData)

      // Complete progress
      clearInterval(progressInterval)
      setUploadState(prev => ({
        ...prev,
        progress: 100,
        completed: true,
        uploading: false,
        uploadedFileData: result
      }))

      toast.success('File uploaded successfully!')
      return result

    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        error: error.message,
        progress: 0
      }))
      toast.error(error.message || 'Upload failed')
      throw error
    }
  }, [validateFile])

  const retryUpload = useCallback(() => {
    if (uploadState.file) {
      startUpload(uploadState.file)
    }
  }, [uploadState.file, startUpload])

  return {
    uploadState,
    startUpload,
    resetUpload,
    retryUpload,
    validateFile
  }
}