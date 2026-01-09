import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function LiveCounter() {
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

  const percentage = Math.round((claimed / total) * 100);

  return (
    <div className="bg-black/60 backdrop-blur-md border border-emerald-500/30 rounded-xl p-6 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">Live Claims</p>
            <p className="text-gray-400 text-xs">Real-time updates</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-emerald-400 text-xs font-medium">LIVE</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-4xl font-bold text-white">{claimed}</span>
            <span className="text-gray-400 text-xl ml-2">/ {total}</span>
          </div>
          <span className="text-emerald-400 text-sm font-semibold">{percentage}%</span>
        </div>
        <p className="text-gray-400 text-sm">people claimed their Free 4 SOL</p>
      </div>

      <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
}
