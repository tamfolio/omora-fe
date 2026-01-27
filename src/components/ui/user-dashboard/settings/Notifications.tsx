import React, { useState } from 'react';

// Define types
type NotificationChannel = 'push' | 'email' | 'sms';
type NotificationId = 'investmentUpdate' | 'marketSentiment' | 'monthlyReports' | 'platformAnnouncement';

interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
}

interface NotificationsState {
  investmentUpdate: NotificationSettings;
  marketSentiment: NotificationSettings;
  monthlyReports: NotificationSettings;
  platformAnnouncement: NotificationSettings;
}

interface TargetNotification {
  notificationId: NotificationId;
  type: NotificationChannel;
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

interface NotificationType {
  id: NotificationId;
  title: string;
  description: string;
}

const Notifications = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [targetNotification, setTargetNotification] = useState<TargetNotification | null>(null);
  
  const [notifications, setNotifications] = useState<NotificationsState>({
    investmentUpdate: {
      push: true,
      email: true,
      sms: false
    },
    marketSentiment: {
      push: true,
      email: false,
      sms: false
    },
    monthlyReports: {
      push: false,
      email: false,
      sms: false
    },
    platformAnnouncement: {
      push: false,
      email: false,
      sms: false
    }
  });

  const notificationTypes: NotificationType[] = [
    {
      id: 'investmentUpdate',
      title: 'Investment Update',
      description: 'Daily DCA logs,rebalancing alerts'
    },
    {
      id: 'marketSentiment',
      title: 'Market Sentiment Alerts',
      description: 'These are notifications for for market seniment alerts.'
    },
    {
      id: 'monthlyReports',
      title: 'Monthly Reports',
      description: 'These are notifications to update you on Monthly reports'
    },
    {
      id: 'platformAnnouncement',
      title: 'Platform announcement',
      description: 'These are notifications platform form announcement.'
    }
  ];

  const handleToggle = (notificationId: NotificationId, type: NotificationChannel, currentValue: boolean) => {
    if (currentValue && (notificationId === 'investmentUpdate' && type === 'push')) {
      setTargetNotification({ notificationId, type });
      setShowWarning(true);
      return;
    }

    setNotifications(prev => ({
      ...prev,
      [notificationId]: {
        ...prev[notificationId],
        [type]: !currentValue
      }
    }));
  };

  const confirmTurnOff = () => {
    if (targetNotification) {
      setNotifications(prev => ({
        ...prev,
        [targetNotification.notificationId]: {
          ...prev[targetNotification.notificationId],
          [targetNotification.type]: false
        }
      }));
    }
    setShowWarning(false);
    setTargetNotification(null);
  };

  const cancelTurnOff = () => {
    setShowWarning(false);
    setTargetNotification(null);
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }: ToggleSwitchProps) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
        checked ? 'bg-teal-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <>
      <div className="w-full px-24 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Notification settings</h2>
            <p className="text-sm text-gray-600 mt-1">
              We may still send you important notifications about your account outside of your notification settings.
            </p>
          </div>

          <div className="p-6 space-y-8">
            {notificationTypes.map((notificationType) => (
              <div key={notificationType.id} className="space-y-4">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{notificationType.title}</h3>
                  <p className="text-sm text-gray-500">{notificationType.description}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Push</span>
                    <ToggleSwitch
                      checked={notifications[notificationType.id].push}
                      onChange={() => handleToggle(
                        notificationType.id, 
                        'push', 
                        notifications[notificationType.id].push
                      )}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Email</span>
                    <ToggleSwitch
                      checked={notifications[notificationType.id].email}
                      onChange={() => handleToggle(
                        notificationType.id, 
                        'email', 
                        notifications[notificationType.id].email
                      )}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">SMS</span>
                    <ToggleSwitch
                      checked={notifications[notificationType.id].sms}
                      onChange={() => handleToggle(
                        notificationType.id, 
                        'sms', 
                        notifications[notificationType.id].sms
                      )}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Warning</h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              You may miss important investment updates by disabling this notification.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={confirmTurnOff}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Turn off Notification
              </button>
              <button
                onClick={cancelTurnOff}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notifications;