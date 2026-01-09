import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useWallet } from '../lib/wallet';
import { CheckCircle2, Loader2, Wallet } from 'lucide-react';

export default function SubmissionForm() {
  const { walletAddress, isConnected, connect } = useWallet();
  const [claiming, setClaiming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleClaim = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    setClaiming(true);
    setError('');

    try {
      const { error: submitError } = await supabase
        .from('nft_entries')
        .insert([
          {
            wallet_address: walletAddress,
            email: null,
            twitter_handle: null,
          },
        ]);

      if (submitError) {
        if (submitError.code === '23505') {
          setError('This wallet address has already been registered');
        } else {
          setError('Failed to register wallet. Please try again.');
        }
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Failed to claim. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  if (success) {
    return (
      <div className="bg-black/90 backdrop-blur-md rounded-2xl border border-gray-800 p-8 max-w-md w-full text-center relative">
        <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
          <span className="text-emerald-400 text-xs font-medium">Registered</span>
        </div>
        <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Successfully Registered!</h3>
        <p className="text-gray-400 mb-6">
          Your wallet has been added to the giveaway. You'll receive your NFT soon!
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-emerald-400 hover:text-emerald-300 font-medium transition"
        >
          Submit another entry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black/90 backdrop-blur-md rounded-2xl border border-gray-800 p-8 max-w-md w-full relative">
      <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-emerald-400 text-xs font-medium">Live</span>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-3">
        Free Mint Claim
      </h2>

      <p className="text-gray-400 mb-6">
        Connect your Phantom wallet and claim your free NFT now.
      </p>

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleClaim}
          disabled={claiming}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-lg transition flex items-center justify-center space-x-3 disabled:cursor-not-allowed"
        >
          {claiming ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Wallet className="w-6 h-6" />
              <span>Claim Free Mint</span>
            </>
          )}
        </button>

        {isConnected && walletAddress && (
          <p className="text-xs text-gray-500 break-all">
            Connected: {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
          </p>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-800/50 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Note: Free mints still require you to pay Solana network fees.
          </p>
        </div>
      </div>
    </div>
  );
}
