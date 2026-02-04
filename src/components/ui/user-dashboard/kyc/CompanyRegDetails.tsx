import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, AlertCircle } from 'lucide-react';
import Logo from '../../Logo';
import { submitCompanyRegistration } from '@/lib/kyc-api-service';

interface CompanyRegDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
}

function CompanyRegDetails({ onNext, onBack }: CompanyRegDetailsProps) {
  // State for single files
  const [certOfIncorporation, setCertOfIncorporation] = useState<UploadedFile | null>(null);
  const [statusOrLicense, setStatusOrLicense] = useState<UploadedFile | null>(null);
  const [boardOrAuth, setBoardOrAuth] = useState<UploadedFile | null>(null);
  
  // State for multiple files (arrays)
  const [directorDocs, setDirectorDocs] = useState<UploadedFile[]>([]);
  const [proofOfAddress, setProofOfAddress] = useState<UploadedFile[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRefs = {
    cert: useRef<HTMLInputElement>(null),
    status: useRef<HTMLInputElement>(null),
    board: useRef<HTMLInputElement>(null),
    directors: useRef<HTMLInputElement>(null),
    address: useRef<HTMLInputElement>(null),
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError('Only PDF, PNG, and JPG files are allowed');
      return false;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return false;
    }

    return true;
  };

  const handleSingleFile = (
    file: File,
    setter: React.Dispatch<React.SetStateAction<UploadedFile | null>>
  ) => {
    if (validateFile(file)) {
      setter({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      });
      setError(null);
    }
  };

  const handleMultipleFiles = (
    files: FileList,
    currentFiles: UploadedFile[],
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  ) => {
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (validateFile(file)) {
        newFiles.push({
          file,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    }

    setter([...currentFiles, ...newFiles]);
    setError(null);
  };

  const removeArrayFile = (
    index: number,
    currentFiles: UploadedFile[],
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  ) => {
    const updated = currentFiles.filter((_, i) => i !== index);
    setter(updated);
  };

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (!certOfIncorporation) {
      setError('Certificate of Incorporation is required');
      return;
    }

    if (!statusOrLicense) {
      setError('Status Extract or Operating License is required');
      return;
    }

    if (!boardOrAuth) {
      setError('Board Resolution or Authorization Letter is required');
      return;
    }

    if (directorDocs.length === 0) {
      setError('At least one Director ID is required');
      return;
    }

    if (proofOfAddress.length === 0) {
      setError('At least one Proof of Address is required');
      return;
    }

    setIsSubmitting(true);
  try {
    const formData = new FormData();

    // 1. Append Single Files
    // Ensure these keys ("CertOfIncorporation", "StatusExtract") match the Backend DTO exactly
    formData.append('CertOfIncorporation', certOfIncorporation.file);
    formData.append('StatusExtract', statusOrLicense.file);
    formData.append('AuthorizationLetter', boardOrAuth.file);

    // 2. Append Arrays
    directorDocs.forEach((doc) => {
      formData.append('DirectorsIdentification', doc.file);
    });

    proofOfAddress.forEach((doc) => {
      formData.append('ProofOfAddress', doc.file);
    });

// Log the FormData keys
for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
    // 3. Call the 'Registration/Add-or-Update' Endpoint
   const response = await fetch('/api/proxy/user/api/v1/onboarding/business/registration/add-or-update', {
     method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Safe error handling
        let errorMessage = 'Failed to submit documents';
        try {
          // Read raw text first
          const errorText = await response.text(); 
          try {
             // Try to parse as JSON
             const result = JSON.parse(errorText);
             errorMessage = result.message || errorMessage;
          } catch {
             // If JSON parse fails, show the raw text (truncated) or status
             console.error("Non-JSON Error Response:", errorText);
             errorMessage = `Server Error (${response.status}): ${errorText.substring(0, 100) || response.statusText}`;
          }
        } catch (e) {
          // If reading text fails
          errorMessage = `Connection Error (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      onNext();
  } catch (err: any) {
    setError(err.message || 'Failed to submit documents');
  } finally {
    setIsSubmitting(false);
  }
};

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <Logo />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-center mb-2">Company Registration Documents</h1>
        <p className="text-sm text-gray-600 text-center mb-8">
          Upload the required documents (PDF, PNG, or JPG, max 5MB each)
        </p>

        <div className="space-y-6">
          {/* 1. Certificate of Incorporation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate of Incorporation <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRefs.cert}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleSingleFile(e.target.files[0], setCertOfIncorporation)}
            />
            {certOfIncorporation ? (
              <div className="flex items-center justify-between p-3 border border-green-300 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">{certOfIncorporation.name} ({formatFileSize(certOfIncorporation.size)})</span>
                <button onClick={() => setCertOfIncorporation(null)} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRefs.cert.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-teal-500 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload</p>
              </button>
            )}
          </div>

          {/* 2. Status Extract OR Operating License */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Extract or Operating License <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRefs.status}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleSingleFile(e.target.files[0], setStatusOrLicense)}
            />
            {statusOrLicense ? (
              <div className="flex items-center justify-between p-3 border border-green-300 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">{statusOrLicense.name} ({formatFileSize(statusOrLicense.size)})</span>
                <button onClick={() => setStatusOrLicense(null)} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRefs.status.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-teal-500 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload</p>
              </button>
            )}
          </div>

          {/* 3. Board Resolution OR Authorization Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Board Resolution or Authorization Letter <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRefs.board}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleSingleFile(e.target.files[0], setBoardOrAuth)}
            />
            {boardOrAuth ? (
              <div className="flex items-center justify-between p-3 border border-green-300 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">{boardOrAuth.name} ({formatFileSize(boardOrAuth.size)})</span>
                <button onClick={() => setBoardOrAuth(null)} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRefs.board.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-teal-500 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload</p>
              </button>
            )}
          </div>

          {/* 4. Directors Identification (Multiple) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Directors Identification <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(Multiple files allowed)</span>
            </label>
            <input
              ref={fileInputRefs.directors}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleMultipleFiles(e.target.files, directorDocs, setDirectorDocs)}
            />
            <div className="space-y-2">
              {directorDocs.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-green-300 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">{doc.name} ({formatFileSize(doc.size)})</span>
                  <button onClick={() => removeArrayFile(index, directorDocs, setDirectorDocs)} className="text-red-500 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRefs.directors.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-teal-500 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload (multiple files allowed)</p>
              </button>
            </div>
          </div>

          {/* 5. Proof of Address (Multiple) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proof of Address <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(Multiple files allowed)</span>
            </label>
            <input
              ref={fileInputRefs.address}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleMultipleFiles(e.target.files, proofOfAddress, setProofOfAddress)}
            />
            <div className="space-y-2">
              {proofOfAddress.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-green-300 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">{doc.name} ({formatFileSize(doc.size)})</span>
                  <button onClick={() => removeArrayFile(index, proofOfAddress, setProofOfAddress)} className="text-red-500 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRefs.address.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-teal-500 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload (multiple files allowed)</p>
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Documents'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyRegDetails;