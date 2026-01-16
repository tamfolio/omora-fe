"use client";

import React, { useState, useRef } from "react";
import { X, UploadCloud } from "lucide-react";
import UploadSuccessModal from "@/components/fund-wallet/withdraw-modal/UploadSuccessModal";

interface UploadedFile {
  name: string;
  status: "uploading" | "success" | "error";
  errorMessage?: string;
}

export default function UpgradeLimitPage() {
  const [document, setDocument] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFileTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): { isValid: boolean; errorMessage?: string } => {
    if (!acceptedFileTypes.includes(file.type)) {
      return {
        isValid: false,
        errorMessage: "Only PDF, PNG, JPG files are allowed",
      };
    }
    if (file.size > maxFileSize) {
      return {
        isValid: false,
        errorMessage: "File size must be less than 5MB",
      };
    }
    return { isValid: true };
  };

  const handleFileUpload = (file: File) => {
    const validation = validateFile(file);

    if (!validation.isValid) {
      setDocument({
        name: file.name,
        status: "error",
        errorMessage: validation.errorMessage,
      });
      return;
    }

    // Simulate upload process
    setDocument({
      name: file.name,
      status: "uploading",
    });

    // Simulate upload completion after 2 seconds
    setTimeout(() => {
      setDocument((prev) =>
        prev
          ? {
              ...prev,
              status: "success",
            }
          : null
      );
    }, 2000);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removeDocument = () => {
    setDocument(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (document && document.status === "success") {
      // Handle submission logic here
      console.log("Document submitted:", document);
      // Show success modal
      setShowSuccessModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-medium text-[#181D27] mb-3">
            Upload Your Document
          </h1>
        </div>

        {/* Instruction */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-[#181D27]">
            1. Recent utility bill (Not more than 3 months old){" "}
            <span className="text-[#008B99]">*</span>
          </label>
        </div>

        {/* Upload Area */}
        <div
          className={`relative border rounded-[12px] p-12 text-center transition-colors mb-4 ${
            isDragging
              ? "border-[#008B99] bg-[#E9EAEB]"
              : document?.status === "error"
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-gray-50 hover:border-[#008B99] hover:bg-[#E6F7F9]"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
          />

          {document && document.status === "uploading" ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008B99] mb-2"></div>
              <p className="text-sm text-[#535862]">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center cursor-pointer">
              <div className="mb-4 relative border p-[10px] rounded-[8px] border-[#D5D7DA]">
                <UploadCloud size={20} color="#414651" />
              </div>
              <p className="text-sm font-medium text-[#535862] mb-2">
                <span className=" text-[#A4A7AE] font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-[#535862]">
                PDF, PNG, JPG (max. 800x400px)
              </p>
            </div>
          )}
        </div>

        {/* File Display */}
        {document && (
          <div className="mb-6">
            {/* File name display */}
            <div className="flex items-center gap-2 p-1 rounded-[8px]">
              <span className="text-sm text-[#181D27]">{document.name}</span>
              <button
                onClick={removeDocument}
                className="text-gray-400 hover:text-red-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Error message */}
            {document.status === "error" && (
              <div className="flex items-center gap-2 p-1 rounded-[8px]">
                <span className="text-sm text-red-600">
                  {document.name} failed to upload
                </span>
                <button
                  onClick={removeDocument}
                  className="text-red-400 hover:text-red-600"
                >
                  <X size={24} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!document || document.status !== "success"}
          className={`w-full py-3 rounded-[8px] font-semibold text-white transition-colors mb-3 ${
            document && document.status === "success"
              ? "bg-[#008B99] hover:bg-[#00717D]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>

      <UploadSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onConfirm={() => {
          //additional logic after confirmation
          setShowSuccessModal(false);
        }}
      />
    </div>
  );
}

