import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, X, AlertCircle } from 'lucide-react';
import Logo from '../../Logo';

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
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <Logo />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Step 4/4</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Company Registration Documents</h1>

        <div className="space-y-8">
          {/* 1. Certificate of Incorporation */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              1. Certificate of Incorporation (CAC) <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRefs.cert}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.svg"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleSingleFile(e.target.files[0], setCertOfIncorporation)}
            />
            {certOfIncorporation ? (
              <div className="flex items-center justify-between p-4 border border-green-300 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">{certOfIncorporation.name}</span>
                </div>
                <button onClick={() => setCertOfIncorporation(null)} className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRefs.cert.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-teal-500 hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800×400px)</p>
              </button>
            )}
          </div>

          {/* 2. CAC Form 2 & 7 / Status Extract */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              2. CAC Form 2 & 7 / Status Extract <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRefs.status}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.svg"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleSingleFile(e.target.files[0], setStatusOrLicense)}
            />
            {statusOrLicense ? (
              <div className="flex items-center justify-between p-4 border border-green-300 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">{statusOrLicense.name}</span>
                </div>
                <button onClick={() => setStatusOrLicense(null)} className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRefs.status.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-teal-500 hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800×400px)</p>
              </button>
            )}
            <div className="mt-2 text-xs text-gray-500 italic">
              This is a letter that must be written by
            </div>
          </div>

          {/* 3. Board Resolution or Authorization Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              3. Board Resolution or Authorization Letter <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRefs.board}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.svg"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleSingleFile(e.target.files[0], setBoardOrAuth)}
            />
            {boardOrAuth ? (
              <div className="flex items-center justify-between p-4 border border-green-300 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">{boardOrAuth.name}</span>
                </div>
                <button onClick={() => setBoardOrAuth(null)} className="text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRefs.board.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-teal-500 hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800×400px)</p>
              </button>
            )}
          </div>

          {/* 4. Valid Government-Issued ID of Director */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              4. Valid Government-Issued ID of Director <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRefs.directors}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.svg"
              className="hidden"
              onChange={(e) => e.target.files && handleMultipleFiles(e.target.files, directorDocs, setDirectorDocs)}
            />
            <div className="space-y-2">
              {directorDocs.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-green-300 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">{doc.name}</span>
                  </div>
                  <button onClick={() => removeArrayFile(index, directorDocs, setDirectorDocs)} className="text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRefs.directors.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-teal-500 hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800×400px)</p>
              </button>
            </div>
          </div>

          {/* 5. Recent utility bill (Not more than 3 months old) */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              5. Recent utility bill (Not more than 3 months old) <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRefs.address}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.svg"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleMultipleFiles(e.target.files, proofOfAddress, setProofOfAddress)}
            />
            <div className="space-y-2">
              {proofOfAddress.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-green-300 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">{doc.name}</span>
                  </div>
                  <button onClick={() => removeArrayFile(index, proofOfAddress, setProofOfAddress)} className="text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRefs.address.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-teal-500 hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 800×400px)</p>
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mt-6">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 mt-8 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyRegDetails;