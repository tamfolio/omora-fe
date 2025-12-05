"use client";
import Image from "next/image";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle } from "lucide-react";

interface UpgradeLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function UpgradeLimitModal({
  isOpen,
  onClose,
  onConfirm,
}: UpgradeLimitModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onConfirm?.();
    onClose();
    router.push("/dashboard/upgrade-limit");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 !rounded-[16px] bg-white max-w-[400px] h-fit max-h-full overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-[#DCFAE6] p-4 rounded-full">
              <Image src="/assets/images/dashboard/shield.svg" alt="Upgrade Limit" width={24} height={24} />
            </div>
          </div>
          <DialogTitle className="text-lg font-semibold text-[#181D27] text-center mb-[2px]">
          Increase Your Limit
          </DialogTitle>
        </DialogHeader>

        <p className="text-[#535862] text-center">
        You need to upload a utility bill not more than 3months old to increase your limit.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            className="bg-[#008B99] hover:bg-[#008B99] text-white font-semibold rounded-[8px]"
            onClick={handleUpgrade}
          >
            Yes, I want to Upgrade
          </Button>
          <Button
            variant="outline"
            className="rounded-[8px] border border-gray-300 font-semibold"
            onClick={onClose}
          >
            No, I don&apos;t
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

