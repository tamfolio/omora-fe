"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface UploadSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function UploadSuccessModal({
  isOpen,
  onClose,
  onConfirm,
}: UploadSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 !rounded-[16px] bg-white max-w-[400px] h-fit max-h-full overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-[#DCFAE6] p-4 rounded-full">
              <CheckCircle2 size={24} color="#008B99" />
            </div>
          </div>
          <DialogTitle className="text-lg font-semibold text-[#181D27] text-center mb-[2px]">
          Upload  Successfully
          </DialogTitle>
        </DialogHeader>

        <p className="text-[#535862] text-center">
            Your document is under review and your status will be updated shortly.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            className="bg-[#008B99] hover:bg-[#008B99] text-white font-semibold rounded-[8px]"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            Back to balance
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

