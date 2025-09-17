import React from "react";

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  label: string;
  rightContent?: React.ReactNode;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  isOn, 
  onToggle, 
  label, 
  rightContent 
}) => {
  return (
    <div className="pt-4 border-t border-gray-100">
      <label className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onToggle}
            className="relative"
          >
            <div className={`w-12 h-6 ${isOn ? 'bg-green-500' : 'bg-gray-200'} rounded-full p-1 transition-colors`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
          </button>
          <span className="ml-3 text-sm text-gray-700">
            {label}
          </span>
        </div>
        {rightContent && (
          <div className="text-sm text-gray-600">
            {rightContent}
          </div>
        )}
      </label>
    </div>
  );
};

export default ToggleSwitch;