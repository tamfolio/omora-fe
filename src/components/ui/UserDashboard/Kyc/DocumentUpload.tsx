import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  onNext: () => void;
  onBack: () => void;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

interface DocumentState {
  identificationCard: UploadedFile | null;
  utilityBill: UploadedFile | null;
}

function DocumentUpload({ onNext, onBack }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<DocumentState>({
    identificationCard: null,
    utilityBill: null
  });

  const [dragStates, setDragStates] = useState({
    identificationCard: false,
    utilityBill: false
  });

  const idCardInputRef = useRef<HTMLInputElement>(null);
  const utilityBillInputRef = useRef<HTMLInputElement>(null);

  const acceptedFileTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): { isValid: boolean; errorMessage?: string } => {
    if (!acceptedFileTypes.includes(file.type)) {
      return { isValid: false, errorMessage: 'Only PDF, PNG, JPG files are allowed' };
    }
    if (file.size > maxFileSize) {
      return { isValid: false, errorMessage: 'File size must be less than 5MB' };
    }
    return { isValid: true };
  };

  const handleFileUpload = (file: File, documentType: keyof DocumentState) => {
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      setDocuments(prev => ({
        ...prev,
        [documentType]: {
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error',
          errorMessage: validation.errorMessage
        }
      }));
      return;
    }

    // Simulate upload process
    setDocuments(prev => ({
      ...prev,
      [documentType]: {
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading'
      }
    }));

    // Simulate upload completion after 2 seconds
    setTimeout(() => {
      setDocuments(prev => ({
        ...prev,
        [documentType]: prev[documentType] ? {
          ...prev[documentType],
          status: 'success'
        } : null
      }));
    }, 2000);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, documentType: keyof DocumentState) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, documentType);
    }
  };

  const handleDragOver = (event: React.DragEvent, documentType: keyof DocumentState) => {
    event.preventDefault();
    setDragStates(prev => ({ ...prev, [documentType]: true }));
  };

  const handleDragLeave = (event: React.DragEvent, documentType: keyof DocumentState) => {
    event.preventDefault();
    setDragStates(prev => ({ ...prev, [documentType]: false }));
  };

  const handleDrop = (event: React.DragEvent, documentType: keyof DocumentState) => {
    event.preventDefault();
    setDragStates(prev => ({ ...prev, [documentType]: false }));
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file, documentType);
    }
  };

  const removeDocument = (documentType: keyof DocumentState) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: null
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isFormValid = () => {
    return documents.identificationCard?.status === 'success' && 
           documents.utilityBill?.status === 'success';
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      console.log('Documents uploaded successfully:', documents);
      onNext();
    }
  };

  const UploadArea = ({ 
    documentType, 
    title, 
    required = false 
  }: { 
    documentType: keyof DocumentState; 
    title: string; 
    required?: boolean;
  }) => {
    const document = documents[documentType];
    const isDragging = dragStates[documentType];
    const inputRef = documentType === 'identificationCard' ? idCardInputRef : utilityBillInputRef;

    return (
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          {title} {required && <span className="text-red-500">*</span>}
        </label>
        
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-teal-400 bg-teal-50'
              : document?.status === 'error'
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50'
          }`}
          onDragOver={(e) => handleDragOver(e, documentType)}
          onDragLeave={(e) => handleDragLeave(e, documentType)}
          onDrop={(e) => handleDrop(e, documentType)}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => handleFileSelect(e, documentType)}
            className="hidden"
          />
          
          {!document && (
            <>
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <div className="text-sm text-gray-600 mb-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Click to upload
                </button>
                <span> or drag and drop</span>
              </div>
              <div className="text-xs text-gray-500">
                PDF, PNG, JPG (max. 800x400px)
              </div>
            </>
          )}

          {document && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  document.status === 'success' ? 'bg-green-100' :
                  document.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  {document.status === 'uploading' && (
                    <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {document.status === 'success' && (
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  )}
                  {document.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">{document.name}</div>
                  <div className="text-xs text-gray-500">{formatFileSize(document.size)}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeDocument(documentType)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}
        </div>

        {document?.status === 'error' && document.errorMessage && (
          <div className="mt-2 flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{document.errorMessage}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-600 font-medium">Back</span>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-800">MORA</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Step 4/5</div>
            <div className="text-sm font-medium text-gray-700">Upload Your Document</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-teal-500 flex items-center justify-center relative">
            <span className="text-sm font-semibold text-teal-500">80%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-12">
          Upload Your Document
        </h1>

        <div className="space-y-8">
          <UploadArea 
            documentType="identificationCard"
            title="1. Identification Card (Driver's license, NIN, International Passport)"
            required
          />

          <UploadArea 
            documentType="utilityBill"
            title="2. Recent utility bill (Not more than 3 months old)"
            required
          />

          {/* Submit Button */}
          <div className="pt-8">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isFormValid()
                  ? 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Support Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  );
}

export default DocumentUpload;