import { Menu, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import SubmissionForm from './components/SubmissionForm';
import GeometricBackground from './components/GeometricBackground';
import ClaimNotifications from './components/ClaimNotifications';
import LiveCounter from './components/LiveCounter';
import { useWallet } from './lib/wallet';

function App() {
  const { walletAddress, isConnected, isConnecting, connect } = useWallet();
  const [claimed, setClaimed] = useState(20);
  const total = 150;

  useEffect(() => {
    const interval = setInterval(() => {
      setClaimed((prev) => {
        if (prev >= total) return total;
        return prev + 1;
      });
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <GeometricBackground />
      <ClaimNotifications claimed={claimed} total={total} />

      {/* Header */}
      <header className="relative z-20 border-b border-gray-800/50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-emerald-500 rotate-45 transform"></div>
            <span className="text-white text-xl font-semibold">YourBrand</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition">About</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Roadmap</a>
            <a href="#" className="text-gray-300 hover:text-white transition">FAQ</a>
            <button
              onClick={connect}
              disabled={isConnected || isConnecting}
              className="px-5 py-2 border-2 border-emerald-500 text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Wallet className="w-4 h-4" />
              <span>
                {isConnecting ? 'Connecting...' : isConnected ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
              </span>
            </button>
          </nav>
          <button className="md:hidden text-gray-300 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left side - Hero content */}
          <div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              The New Standard<br />
              <span className="text-emerald-400">for your NFT drop</span>
            </h1>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
              Exclusive NFT collection launching today. Connect your wallet and claim your free mint while supplies last.
            </p>

            <div className="flex items-center space-x-2 text-emerald-400 mb-8">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-sm font-medium">Mint is live now</span>
            </div>

            <LiveCounter claimed={claimed} total={total} />
          </div>

          {/* Right side - Form card */}
          <div className="flex justify-center lg:justify-end">
            <SubmissionForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
