import { useState, useRef } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { Camera, UploadCloud, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function CleanerFormPage() {
  const [formData, setFormData] = useState({
    property_name: '',
    floor_number: '',
    room_number: '',
    cleaner_name: '',
    cleaner_id: '',
    cleaning_status: 'Pending',
    cleaning_type: 'Regular Cleaning',
    priority: 'Medium',
    issues_found: [],
    notes: ''
  });

  const [images, setImages] = useState({ before: null, after: null });
  const [previews, setPreviews] = useState({ before: null, after: null });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIssueToggle = (issue) => {
    setFormData(prev => {
      const current = prev.issues_found;
      if (current.includes(issue)) {
        return { ...prev, issues_found: current.filter(i => i !== issue) };
      } else {
        return { ...prev, issues_found: [...current, issue] };
      }
    });
  };

  const handleImageCapture = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setImages(prev => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'issues_found') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      if (images.before) data.append('before_image', images.before);
      if (images.after) data.append('after_image', images.after);

      await axios.post('http://localhost:5000/api/cleaning', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Task submitted successfully!', {
        duration: 4000,
        style: {
          borderRadius: '16px',
          background: '#10b981',
          color: '#fff',
          fontWeight: 'bold',
          padding: '16px 24px',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10b981'
        }
      });

      setFormData({
        property_name: '', floor_number: '', room_number: '',
        cleaner_name: formData.cleaner_name,
        cleaner_id: formData.cleaner_id,
        cleaning_status: 'Pending', cleaning_type: 'Regular Cleaning',
        priority: 'Medium', issues_found: [], notes: ''
      });
      setImages({ before: null, after: null });
      setPreviews({ before: null, after: null });
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit task. Please check server connection.', {
        style: {
          borderRadius: '16px',
          background: '#ef4444',
          color: '#fff',
          fontWeight: 'bold',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const issueOptions = ['Plumbing Issue', 'Electrical Issue', 'Damaged Furniture', 'Dirty Linen', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 w-full flex flex-col items-center">
      <div className="w-full max-w-lg">
        <div className="bg-primary-600 text-white p-6 shadow-md rounded-b-3xl mb-6">
          <h1 className="text-2xl font-bold">New Cleaning Task</h1>
          <p className="text-primary-100 mt-1 opacity-90">Submit your cleaning progress</p>
        </div>

        <div className="px-4 w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Location</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Property Name *</label>
                  <input required name="property_name" value={formData.property_name} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none" placeholder="e.g. Azzurro Downtown" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Room *</label>
                    <input required name="room_number" value={formData.room_number} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none" placeholder="e.g. 101" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Floor</label>
                    <input name="floor_number" value={formData.floor_number} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none" placeholder="e.g. 1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status *</label>
                  <select name="cleaning_status" value={formData.cleaning_status} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                  <select name="cleaning_type" value={formData.cleaning_type} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                    <option>Regular Cleaning</option>
                    <option>Deep Cleaning</option>
                    <option>Checkout Cleaning</option>
                    <option>Maintenance Required</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Issues Found</h2>
              <div className="flex flex-wrap gap-2">
                {issueOptions.map(issue => (
                  <button
                    type="button"
                    key={issue}
                    onClick={() => handleIssueToggle(issue)}
                    className={clsx(
                      'px-4 py-2 rounded-full text-sm font-medium transition-colors border',
                      formData.issues_found.includes(issue)
                        ? 'bg-primary-100 text-primary-700 border-primary-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    {issue}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-600 mb-2">Notes / Comments</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Any additional notes..."></textarea>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Photos</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600 text-center">Before Cleaning</label>
                  <label className="flex flex-col items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden group">
                    {previews.before ? (
                       <img src={previews.before} className="w-full h-full object-cover" alt="Before" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-gray-500">Tap to capture</span>
                      </>
                    )}
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleImageCapture(e, 'before')} />
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600 text-center">After Cleaning *</label>
                  <label className="flex flex-col items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden group">
                    {previews.after ? (
                       <img src={previews.after} className="w-full h-full object-cover" alt="After" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-primary-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs text-primary-600 font-medium">Capture *</span>
                      </>
                    )}
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleImageCapture(e, 'after')} required={!images.after} />
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Cleaner Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Your Name *</label>
                  <input required name="cleaner_name" value={formData.cleaner_name} onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="John Doe" />
                </div>
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-lg">
              {loading ? 'Submitting...' : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  Submit Report
                </>
              )}
            </button>
          </form>

          {/* ADDED ADMIN LINK FOR EASY TESTING */}
          <div className="mt-8 mb-4 text-center">
            <Link to="/admin" className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors border-b border-transparent hover:border-primary-600 pb-1">
              Access Admin Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
