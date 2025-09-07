import { FaRegCirclePause, FaRegCirclePlay } from "react-icons/fa6";

interface DCAModalProps {
  isOpen: boolean;
  isDCAPaused: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DCAModal({
  isOpen,
  isDCAPaused,
  onConfirm,
  onCancel,
}: DCAModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isDCAPaused ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {isDCAPaused ? (
              <FaRegCirclePlay className="w-8 h-8 text-green-600" />
            ) : (
              <FaRegCirclePause className="w-8 h-8 text-red-600" />
            )}
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isDCAPaused ? "Activate DCA" : "Pause DCA"}
          </h3>

          <p className="text-gray-600 mb-6">
            Are you sure you want to {isDCAPaused ? "activate" : "pause"} DCA?
          </p>

          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="w-full py-3 px-4 rounded-lg font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors"
            >
              Yes, I want to {isDCAPaused ? "Activate" : "Pause"}
            </button>

            <button
              onClick={onCancel}
              className="w-full py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              No, I don&apos;t
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
