import { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipboardList, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cleaning');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  const total = logs.length;
  const completed = logs.filter(l => l.cleaning_status === 'Completed').length;
  const pending = logs.filter(l => l.cleaning_status === 'Pending').length;
  const issues = logs.filter(l => l.issues_found && l.issues_found !== '[]').length;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Tasks', value: total, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'With Issues', value: issues, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' }
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        {logs.slice(0, 5).length === 0 ? (
          <p className="text-gray-500">No recent activity.</p>
        ) : (
          <div className="space-y-4">
            {logs.slice(0, 5).map(log => (
              <div key={log.id} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                <div>
                  <p className="font-semibold text-gray-900">{log.property_name} - Room {log.room_number}</p>
                  <p className="text-sm text-gray-500">Cleaned by {log.cleaner_name} • {new Date(log.created_at).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  log.cleaning_status === 'Completed' ? 'bg-green-100 text-green-700' :
                  log.cleaning_status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {log.cleaning_status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
