import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ProgressBar from "@/components/atoms/ProgressBar";
import FilePreview from "@/components/molecules/FilePreview";
import FileDropzone from "@/components/molecules/FileDropzone";
import FileNameModal from "@/components/molecules/FileNameModal";
import { uploadFile } from "@/services/api/fileService";
const UploadSection = ({ onUploadComplete }) => {
const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [customFileName, setCustomFileName] = useState('');
const handleFileSelect = (file) => {
    if (!file) {
      toast.error('No file selected');
      return;
    }
    
    setSelectedFile(file);
    setCustomFileName(file.name);
    setShowNameModal(true);
  };

const handleNameSubmit = async (fileName) => {
    // Comprehensive validation of selected file
    if (!selectedFile) {
      toast.error('No file selected');
      setShowNameModal(false);
      return;
    }

    // Validate file object properties
    if (!selectedFile.name) {
      toast.error('Selected file is missing name property');
      setShowNameModal(false);
      setSelectedFile(null);
      return;
    }

    if (selectedFile.size === undefined || selectedFile.size === null) {
      toast.error('Selected file is missing size property');
      setShowNameModal(false);
      setSelectedFile(null);
      return;
    }

    // Validate fileName parameter
    if (fileName !== undefined && fileName !== null && typeof fileName !== 'string') {
      toast.error('Invalid file name provided');
      return;
    }
    setShowNameModal(false);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Upload with custom file name and share data
      const shareData = {
        fileName: fileName || selectedFile.name,
        recipientEmail: null,
        message: null
      };

      const result = await uploadFile(selectedFile, shareData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        onUploadComplete(result);
        toast.success('File uploaded successfully!');
      }, 500);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(0);
      setUploading(false);
      setSelectedFile(null);
      toast.error(error.message || 'Upload failed. Please try again.');
    }
  };

const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploading(false);
    setShowNameModal(false);
    setCustomFileName('');
  };
  if (uploading && selectedFile) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 space-y-6"
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Uploading File...</h3>
          <p className="text-gray-600">Please wait while we process your file</p>
        </div>
        
        <FilePreview file={selectedFile} />
        
        <ProgressBar 
          progress={uploadProgress} 
          showPercentage={true}
          size="lg"
        />
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Do not close this window during upload
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Share Files Instantly
        </h1>
        <p className="text-gray-600 text-lg">
          Upload up to 100MB and generate secure download links
        </p>
      </div>

      <FileDropzone 
        onFileSelect={handleFileSelect}
        loading={uploading}
      />

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">
          Supported formats: Images, Documents, Videos, Audio, Archives
        </p>
<p className="text-xs text-gray-400">
          Files are automatically deleted after 7 days
        </p>
      </div>

{/* File Name Modal */}
      <FileNameModal
        isOpen={showNameModal}
        onClose={() => {
          setShowNameModal(false);
          setSelectedFile(null);
          setCustomFileName('');
        }}
        onConfirm={handleNameSubmit}
        defaultName={customFileName}
      />
    </motion.div>
  );
};

export default UploadSection;