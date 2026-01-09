import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Notification {
  id: number;
  wallet: string;
  amount: number;
}

export default function ClaimNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateWallet = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
    let wallet = '';
    for (let i = 0; i < 44; i++) {
      wallet += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return wallet;
  };

  useEffect(() => {
    const addNotification = () => {
      const newNotification: Notification = {
        id: Date.now(),
        wallet: generateWallet(),
        amount: 4,
      };

      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
      }, 5000);
    };

    const interval = setInterval(() => {
      addNotification();
    }, Math.random() * 4000 + 3000);

    addNotification();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-black/95 backdrop-blur-md border border-emerald-500/30 rounded-lg p-4 shadow-xl animate-slide-in flex items-start space-x-3"
        >
          <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm mb-1">
              Claimed {notification.amount} SOL
            </p>
            <p className="text-gray-400 text-xs truncate">
              {notification.wallet.slice(0, 8)}...{notification.wallet.slice(-8)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
