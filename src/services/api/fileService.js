// Generate random alphanumeric string for slugs
const generateSlug = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
}

export const uploadFile = async (file, shareData = {}) => {
  try {
    // Validate file size (100MB limit)
    const MAX_SIZE = 100 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      throw new Error('File size must be less than 100MB')
    }
    
    // Generate unique slug
    const slug = generateSlug(12)
    
    // Prepare file data for database using exact field names from schema
    const fileData = {
      Name: file.name, // Use Name field from schema
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      slug: slug,
      upload_timestamp: new Date().toISOString(),
      expiration_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      download_count: 0,
      recipient_email: shareData.recipientEmail || null,
      message: shareData.message || null,
      file_path: `/uploads/${slug}_${file.name}`
    }
    
    const apperClient = getApperClient()
    const response = await apperClient.createRecord('file', {
      records: [fileData]
    })
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            throw new Error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) throw new Error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        const createdFile = successfulRecords[0].data;
        // Map database field names back to UI field names for compatibility
        return {
          Id: createdFile.Id,
          fileName: createdFile.file_name,
          fileSize: createdFile.file_size,
          fileType: createdFile.file_type,
          slug: createdFile.slug,
          uploadTimestamp: createdFile.upload_timestamp,
          expirationDate: createdFile.expiration_date,
          downloadCount: createdFile.download_count,
          recipientEmail: createdFile.recipient_email,
          message: createdFile.message,
          filePath: createdFile.file_path
        };
      }
    }
    
    throw new Error('Upload failed - no data returned');
  } catch (error) {
    throw new Error(error.message || 'Upload failed')
  }
}

export const getFileBySlug = async (slug) => {
  try {
    const apperClient = getApperClient()
    
    const params = {
      fields: [
        { field: { Name: "Id" } },
        { field: { Name: "Name" } },
        { field: { Name: "file_name" } },
        { field: { Name: "file_size" } },
        { field: { Name: "file_type" } },
        { field: { Name: "slug" } },
        { field: { Name: "upload_timestamp" } },
        { field: { Name: "expiration_date" } },
        { field: { Name: "download_count" } },
        { field: { Name: "recipient_email" } },
        { field: { Name: "message" } },
        { field: { Name: "file_path" } }
      ],
      where: [
        {
          FieldName: "slug",
          Operator: "EqualTo",
          Values: [slug]
        }
      ]
    }
    
    const response = await apperClient.fetchRecords('file', params)
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data || response.data.length === 0) {
      throw new Error('File not found or expired')
    }
    
    const file = response.data[0]
    
    // Check if file is expired
    if (new Date(file.expiration_date) < new Date()) {
      // Delete expired file
      await apperClient.deleteRecord('file', { RecordIds: [file.Id] })
      throw new Error('File has expired and is no longer available')
    }
    
    // Map database field names back to UI field names for compatibility
    return {
      Id: file.Id,
      fileName: file.file_name,
      fileSize: file.file_size,
      fileType: file.file_type,
      slug: file.slug,
      uploadTimestamp: file.upload_timestamp,
      expirationDate: file.expiration_date,
      downloadCount: file.download_count,
      recipientEmail: file.recipient_email,
      message: file.message,
      filePath: file.file_path
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to retrieve file')
  }
}

export const downloadFile = async (fileId) => {
  try {
    const apperClient = getApperClient()
    
    // Get file data first
    const fileResponse = await apperClient.getRecordById('file', fileId, {
      fields: [
        { field: { Name: "Id" } },
        { field: { Name: "file_name" } },
        { field: { Name: "file_type" } },
        { field: { Name: "expiration_date" } },
        { field: { Name: "download_count" } }
      ]
    })
    
    if (!fileResponse.success || !fileResponse.data) {
      throw new Error('File not found')
    }
    
    const file = fileResponse.data
    
    // Check if file is expired
    if (new Date(file.expiration_date) < new Date()) {
      await apperClient.deleteRecord('file', { RecordIds: [fileId] })
      throw new Error('File has expired')
    }
    
    // Increment download count
    const updateResponse = await apperClient.updateRecord('file', {
      records: [{
        Id: fileId,
        download_count: file.download_count + 1
      }]
    })
    
    if (!updateResponse.success) {
      console.error(updateResponse.message);
      // Continue with download even if count update fails
    }
    
    // In a real app, this would initiate the actual file download
    // For now, we'll simulate it by creating a blob URL
    const blob = new Blob(['Simulated file content'], { type: file.file_type })
    const url = URL.createObjectURL(blob)
    
    // Create download link and trigger download
    const a = document.createElement('a')
    a.href = url
    a.download = file.file_name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    return { success: true, downloadCount: file.download_count + 1 }
  } catch (error) {
    throw new Error(error.message || 'Download failed')
  }
}

export const generateShareLink = async (fileId, shareData = {}) => {
  try {
    const apperClient = getApperClient()
    
    // Get current file data
    const fileResponse = await apperClient.getRecordById('file', fileId, {
      fields: [
        { field: { Name: "Id" } },
        { field: { Name: "slug" } },
        { field: { Name: "expiration_date" } }
      ]
    })
    
    if (!fileResponse.success || !fileResponse.data) {
      throw new Error('File not found')
    }
    
    const file = fileResponse.data
    
    // Update file with share data if provided
    if (shareData.recipientEmail || shareData.message) {
      const updateData = { Id: fileId }
      if (shareData.recipientEmail) updateData.recipient_email = shareData.recipientEmail
      if (shareData.message) updateData.message = shareData.message
      
      const updateResponse = await apperClient.updateRecord('file', {
        records: [updateData]
      })
      
      if (!updateResponse.success) {
        console.error(updateResponse.message);
        // Continue with share link generation even if update fails
      }
    }
    
    const shareUrl = `${window.location.origin}/download/${file.slug}`
    
    return {
      shareUrl,
      expirationDate: file.expiration_date,
      slug: file.slug
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to generate share link')
  }
}

export const getFileStats = async (fileId) => {
  try {
    const apperClient = getApperClient()
    
    const response = await apperClient.getRecordById('file', fileId, {
      fields: [
        { field: { Name: "download_count" } },
        { field: { Name: "upload_timestamp" } },
        { field: { Name: "expiration_date" } }
      ]
    })
    
    if (!response.success || !response.data) {
      throw new Error('File not found')
    }
    
    const file = response.data
    
    return {
      downloadCount: file.download_count,
      uploadTimestamp: file.upload_timestamp,
      expirationDate: file.expiration_date
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to retrieve file stats')
  }
}

// Cleanup expired files (would be run as a scheduled task in production)
export const cleanupExpiredFiles = async () => {
  try {
    const apperClient = getApperClient()
    
    // Get all files that are expired
    const params = {
      fields: [
        { field: { Name: "Id" } },
        { field: { Name: "expiration_date" } }
      ],
      where: [
        {
          FieldName: "expiration_date",
          Operator: "LessThan",
          Values: [new Date().toISOString()]
        }
      ]
    }
    
    const response = await apperClient.fetchRecords('file', params)
    
    if (!response.success) {
      console.error(response.message);
      return { removedCount: 0, remainingCount: 0 }
    }
    
    if (!response.data || response.data.length === 0) {
      return { removedCount: 0, remainingCount: 0 }
    }
    
    // Delete expired files
    const expiredIds = response.data.map(file => file.Id)
    const deleteResponse = await apperClient.deleteRecord('file', {
      RecordIds: expiredIds
    })
    
    if (!deleteResponse.success) {
      console.error(deleteResponse.message);
      return { removedCount: 0, remainingCount: 0 }
    }
    
    // Get remaining count
    const remainingResponse = await apperClient.fetchRecords('file', {
      fields: [{ field: { Name: "Id" } }]
    })
    
    const remainingCount = remainingResponse.success ? (remainingResponse.data?.length || 0) : 0
    
    return { 
      removedCount: expiredIds.length, 
      remainingCount: remainingCount 
    }
  } catch (error) {
    console.error('Cleanup failed:', error);
    return { removedCount: 0, remainingCount: 0 }
  }
}