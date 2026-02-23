import React, { useState, useRef } from 'react';
import { ArrowLeft, X, AlertCircle } from 'lucide-react';
import { FiUploadCloud, FiHeadphones } from 'react-icons/fi';
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
  // --- Logic remains untouched ---
  const [certOfIncorporation, setCertOfIncorporation] = useState<UploadedFile | null>(null);
  const [statusOrLicense, setStatusOrLicense] = useState<UploadedFile | null>(null);
  const [boardOrAuth, setBoardOrAuth] = useState<UploadedFile | null>(null);
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
    const maxSize = 5 * 1024 * 1024;
    if (!validTypes.includes(file.type)) { setError('Only PDF, PNG, and JPG files are allowed'); return false; }
    if (file.size > maxSize) { setError('File size must be less than 5MB'); return false; }
    return true;
  };

  const handleSingleFile = (file: File, setter: React.Dispatch<React.SetStateAction<UploadedFile | null>>) => {
    if (validateFile(file)) { setter({ file, name: file.name, size: file.size, type: file.type }); setError(null); }
  };

  const handleMultipleFiles = (files: FileList, currentFiles: UploadedFile[], setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>) => {
    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) newFiles.push({ file: files[i], name: files[i].name, size: files[i].size, type: files[i].type });
    }
    setter([...currentFiles, ...newFiles]);
    setError(null);
  };

  const removeArrayFile = (index: number, currentFiles: UploadedFile[], setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>) => {
    setter(currentFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!certOfIncorporation || !statusOrLicense || !boardOrAuth || directorDocs.length === 0 || proofOfAddress.length === 0) {
      setError('Please upload all required documents'); return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('CertOfIncorporation', certOfIncorporation.file);
      formData.append('StatusExtract', statusOrLicense.file);
      formData.append('AuthorizationLetter', boardOrAuth.file);
      directorDocs.forEach((doc) => formData.append('DirectorsIdentification', doc.file));
      proofOfAddress.forEach((doc) => formData.append('ProofOfAddress', doc.file));

      const response = await fetch('/api/user/api/v1/onboarding/business/registration/add-or-update', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to submit documents');
      onNext();
    } catch (err: any) {
      setError(err.message || 'Failed to submit documents');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UI Layout Helper ---
  const UploadBox = ({ label, isRequired, file, onUpload, onRemove, infoText }: any) => (
    <div className="mb-8 group">
      <div className="flex items-center gap-1 mb-3">
        <label className="text-[15px] font-medium text-gray-800">
          {label} {isRequired && <span className="text-teal-500">*</span>}
        </label>
        {infoText && (
          <div className="relative group/tooltip">
            <AlertCircle className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-white border border-gray-100 shadow-xl rounded-lg text-[11px] text-gray-500 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 leading-relaxed">
              {infoText}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
            </div>
          </div>
        )}
      </div>

      {file ? (
        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600">
              <FiUploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 max-w-[200px] truncate">{file.name}</p>
              <p className="text-[11px] text-gray-400">Uploaded successfully</p>
            </div>
          </div>
          <button onClick={onRemove} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={onUpload}
          className="w-full bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-xl p-10 hover:border-teal-400 hover:bg-gray-50 transition-all flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center">
            <FiUploadCloud className="w-6 h-6 text-gray-500" />
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1 font-medium">
              <span className="text-teal-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-[11px] text-gray-400 uppercase tracking-wider">SVG, PNG, JPG or GIF (max. 800×400px)</p>
          </div>
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-inter relative">
      {/* Floating Support Icon */}
      <button className="fixed right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-teal-600 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-teal-700 transition-all z-20 group">
        <FiHeadphones className="w-6 h-6" />
        <span className="absolute right-full mr-3 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Contact Support</span>
      </button>

      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <Logo width={120} height={30} />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] text-gray-400 uppercase font-bold">Step 4/4</p>
            <p className="text-xs font-semibold text-gray-700">Upload Your Document</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center text-[10px] font-bold text-teal-600">
            40%
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-6 pt-12 pb-24">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-10 tracking-tight">
          Company Registration Documents
        </h1>

        <div className="space-y-2">
          {/* Inputs remain hidden as per logic */}
          <input ref={fileInputRefs.cert} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleSingleFile(e.target.files[0], setCertOfIncorporation)} />
          <input ref={fileInputRefs.status} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleSingleFile(e.target.files[0], setStatusOrLicense)} />
          <input ref={fileInputRefs.board} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && handleSingleFile(e.target.files[0], setBoardOrAuth)} />
          <input ref={fileInputRefs.directors} type="file" className="hidden" onChange={(e) => e.target.files && handleMultipleFiles(e.target.files, directorDocs, setDirectorDocs)} />
          <input ref={fileInputRefs.address} type="file" className="hidden" multiple onChange={(e) => e.target.files && handleMultipleFiles(e.target.files, proofOfAddress, setProofOfAddress)} />

          <UploadBox 
            label="1. Certificate of Incorporation (CAC)" isRequired 
            file={certOfIncorporation} onUpload={() => fileInputRefs.cert.current?.click()} onRemove={() => setCertOfIncorporation(null)} 
          />

          <UploadBox 
            label="2. CAC Form 2 & 7 / Status Extract" isRequired 
            file={statusOrLicense} onUpload={() => fileInputRefs.status.current?.click()} onRemove={() => setStatusOrLicense(null)} 
          />

          <UploadBox 
            label="3. Board Resolution or Authorization Letter" isRequired 
            file={boardOrAuth} onUpload={() => fileInputRefs.board.current?.click()} onRemove={() => setBoardOrAuth(null)}
            infoText="This is a letter that must be written by the board members to authorize this process." 
          />

          <div className="mb-8">
            <label className="text-[15px] font-medium text-gray-800 mb-3 block">
              4. Valid Government-Issued ID of Director <span className="text-teal-500">*</span>
            </label>
            {directorDocs.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-teal-50/30 border border-teal-100 rounded-xl mb-2">
                <span className="text-xs text-gray-600 truncate max-w-[250px]">{doc.name}</span>
                <button onClick={() => removeArrayFile(idx, directorDocs, setDirectorDocs)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => fileInputRefs.directors.current?.click()} className="w-full py-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-100 transition-colors">
              <FiUploadCloud className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">Upload Director ID</span>
            </button>
          </div>

          <div className="mb-8">
            <label className="text-[15px] font-medium text-gray-800 mb-3 block">
              5. Recent utility bill (Not more than 3 months old) <span className="text-teal-500">*</span>
            </label>
            {proofOfAddress.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-teal-50/30 border border-teal-100 rounded-xl mb-2">
                <span className="text-xs text-gray-600 truncate max-w-[250px]">{doc.name}</span>
                <button onClick={() => removeArrayFile(idx, proofOfAddress, setProofOfAddress)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => fileInputRefs.address.current?.click()} className="w-full py-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-100 transition-colors">
              <FiUploadCloud className="w-5 h-5 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">Upload Utility Bill</span>
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm mb-6">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-100 transition-all disabled:bg-gray-200 disabled:shadow-none mt-4"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default CompanyRegDetails;