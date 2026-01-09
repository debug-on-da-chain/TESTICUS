import { useEffect, useState } from 'react';
import { supabase, type NFTEntry } from '../lib/supabase';
import { Download, RefreshCw, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [entries, setEntries] = useState<NFTEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
    failed: 0,
  });

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('nft_entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEntries(data);
      setStats({
        total: data.length,
        pending: data.filter((e) => e.status === 'pending').length,
        sent: data.filter((e) => e.status === 'sent').length,
        failed: data.filter((e) => e.status === 'failed').length,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const exportToCSV = () => {
    const headers = ['Wallet Address', 'Email', 'Twitter', 'Status', 'Created At', 'TX Hash'];
    const rows = entries.map((entry) => [
      entry.wallet_address,
      entry.email || '',
      entry.twitter_handle || '',
      entry.status,
      new Date(entry.created_at).toLocaleString(),
      entry.tx_hash || '',
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nft-entries-${new Date().toISOString()}.csv`;
    a.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">NFT Giveaway Dashboard</h1>
          <div className="flex space-x-3">
            <button
              onClick={fetchEntries}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg hover:bg-gray-700/80 transition text-gray-200"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition shadow-lg shadow-blue-500/30"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/80 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-6">
            <div className="text-sm font-medium text-gray-400 mb-1">Total Entries</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-6">
            <div className="text-sm font-medium text-gray-400 mb-1">Pending</div>
            <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-6">
            <div className="text-sm font-medium text-gray-400 mb-1">Sent</div>
            <div className="text-3xl font-bold text-green-400">{stats.sent}</div>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl p-6">
            <div className="text-sm font-medium text-gray-400 mb-1">Failed</div>
            <div className="text-3xl font-bold text-red-400">{stats.failed}</div>
          </div>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-md rounded-lg border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Wallet Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Twitter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading entries...
                    </td>
                  </tr>
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No entries yet
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-700/30 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-200">
                        {entry.wallet_address.slice(0, 8)}...{entry.wallet_address.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {entry.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {entry.twitter_handle || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(entry.status)}
                          <span className="text-sm capitalize text-gray-300">{entry.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
