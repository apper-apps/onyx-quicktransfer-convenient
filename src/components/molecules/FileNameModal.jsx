import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const FileNameModal = ({ isOpen, onClose, onConfirm, defaultName = '' }) => {
  const [fileName, setFileName] = useState(defaultName);
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate fileName before submission
    if (!fileName || !fileName.trim()) {
      return;
    }
    
    // Validate onConfirm callback
    if (!onConfirm || typeof onConfirm !== 'function') {
      console.error('onConfirm callback is not provided or not a function');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onConfirm(fileName.trim());
    } catch (error) {
      console.error('Error in FileNameModal submission:', error);
      // Don't re-throw here as the parent component should handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFileName(defaultName);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ApperIcon name="FileText" size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Name Your File</h2>
                    <p className="text-sm text-gray-500">Give your file a custom name</p>
                  </div>
                </div>
                
                {!isSubmitting && (
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-2">
                    File Name
                  </label>
                  <Input
                    id="fileName"
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter a name for your file"
                    disabled={isSubmitting}
                    className="w-full"
                    autoFocus
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!fileName.trim() || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      'Save File'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FileNameModal;