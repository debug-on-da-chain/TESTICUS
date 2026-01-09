import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: () => void) => void;
      publicKey?: { toString: () => string };
    };
  }
}

interface WalletContextType {
  walletAddress: string;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (window.solana?.publicKey) {
      setWalletAddress(window.solana.publicKey.toString());
      setIsConnected(true);
    }

    if (window.solana) {
      window.solana.on('accountChanged', () => {
        if (window.solana?.publicKey) {
          setWalletAddress(window.solana.publicKey.toString());
          setIsConnected(true);
        } else {
          setWalletAddress('');
          setIsConnected(false);
        }
      });
    }
  }, []);

  const connect = async () => {
    if (!window.solana) {
      alert('Please install Phantom wallet to continue');
      return;
    }

    setIsConnecting(true);
    try {
      const response = await window.solana.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (window.solana) {
      await window.solana.disconnect();
      setWalletAddress('');
      setIsConnected(false);
    }
  };

  return (
    <WalletContext.Provider value={{ walletAddress, isConnected, isConnecting, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
