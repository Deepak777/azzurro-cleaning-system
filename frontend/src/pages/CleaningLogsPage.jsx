import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CleaningLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.room_number?.toLowerCase() || '').includes(search.toLowerCase()) || 
      (log.property_name?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesStatus = statusFilter ? log.cleaning_status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Cleaning Logs</h1>
        
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search room or property..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading records...</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                  <th className="p-4">Date</th>
                  <th className="p-4">Property & Room</th>
                  <th className="p-4">Cleaner</th>
                  <th className="p-4">Status & Priority</th>
                  <th className="p-4">Issues</th>
                  <th className="p-4">Images</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredLogs.map(log => {
                  let parsedIssues = [];
                  try {
                    parsedIssues = log.issues_found ? JSON.parse(log.issues_found) : [];
                  } catch (e) {
                    parsedIssues = log.issues_found ? [log.issues_found] : [];
                  }

                  return (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-600">
                        {new Date(log.created_at).toLocaleDateString()}<br/>
                        <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleTimeString()}</span>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-900">{log.property_name}</p>
                        <p className="text-gray-500">Room {log.room_number}</p>
                      </td>
                      <td className="p-4 font-medium text-gray-700">{log.cleaner_name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          log.cleaning_status === 'Completed' ? 'bg-green-100 text-green-700' :
                          log.cleaning_status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {log.cleaning_status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{log.priority} Priority</p>
                      </td>
                      <td className="p-4 max-w-xs">
                        {parsedIssues.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {parsedIssues.map(i => <span key={i} className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs border border-red-100 whitespace-nowrap">{i}</span>)}
                          </div>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                        {log.notes && <p className="text-xs text-gray-500 mt-2 italic">"{log.notes}"</p>}
                      </td>
                      <td className="p-4 flex gap-2">
                        {log.before_image && (
                          <a href={`http://localhost:5000${log.before_image}`} target="_blank" rel="noreferrer">
                            <img src={`http://localhost:5000${log.before_image}`} alt="Before" className="w-12 h-12 rounded object-cover border border-gray-200 hover:opacity-80 transition-opacity cursor-pointer" />
                          </a>
                        )}
                        {log.after_image && (
                          <a href={`http://localhost:5000${log.after_image}`} target="_blank" rel="noreferrer">
                            <img src={`http://localhost:5000${log.after_image}`} alt="After" className="w-12 h-12 rounded object-cover border border-gray-200 hover:opacity-80 transition-opacity cursor-pointer" />
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredLogs.length === 0 && (
              <div className="p-8 text-center text-gray-500">No logs found matching your criteria.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
