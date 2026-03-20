import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { Camera, UploadCloud, X } from 'lucide-react';
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
  
  // Real-time camera states
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [activeCamera, setActiveCamera] = useState(null);

  // Cleanup camera stream when component unmounts
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async (type) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" },
        audio: false
      });
      streamRef.current = stream;
      setActiveCamera(type);
      
      // Allow React to mount the <video> element before assigning stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error(e));
        }
      }, 50);
    } catch (err) {
      console.error(err);
      toast.error('Could not access camera. Please allow Permissions.', {
        style: { borderRadius: '16px', background: '#ef4444', color: '#fff', fontWeight: 'bold' }
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setActiveCamera(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], `${activeCamera}-photo.jpg`, { type: 'image/jpeg' });
      setImages(prev => ({ ...prev, [activeCamera]: file }));
      setPreviews(prev => ({ ...prev, [activeCamera]: URL.createObjectURL(blob) }));
      stopCamera();
    }, 'image/jpeg', 0.8);
  };

  const removeImage = (type) => {
    setImages(prev => ({ ...prev, [type]: null }));
    setPreviews(prev => ({ ...prev, [type]: null }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images.after) {
      toast.error('After Cleaning photo is required!', {
        style: { borderRadius: '16px', background: '#ef4444', color: '#fff', fontWeight: 'bold' }
      });
      return;
    }

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
        iconTheme: { primary: '#fff', secondary: '#10b981' }
      });

      setFormData({
        property_name: '', floor_number: '', room_number: '',
        cleaner_name: '', // CLEARING OUT THE NAME HERE
        cleaner_id: '',
        cleaning_status: 'Pending', cleaning_type: 'Regular Cleaning',
        priority: 'Medium', issues_found: [], notes: ''
      });
      setImages({ before: null, after: null });
      setPreviews({ before: null, after: null });
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit task. Please check server connection.', {
        style: { borderRadius: '16px', background: '#ef4444', color: '#fff', fontWeight: 'bold' }
      });
    } finally {
      setLoading(false);
    }
  };

  const issueOptions = ['Plumbing Issue', 'Electrical Issue', 'Damaged Furniture', 'Dirty Linen', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 w-full flex flex-col items-center relative">
      
      {/* Real-time Camera Overlay */}
      {activeCamera && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center shadow-2xl">
          <button 
            type="button" 
            onClick={stopCamera} 
            className="absolute top-6 right-6 z-50 bg-gray-900 bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-80 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          
          <video 
            ref={videoRef} 
            playsInline 
            autoPlay 
            className="w-full h-full object-cover" 
          />
          
          <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center pb-[env(safe-area-inset-bottom)]">
            <div className="bg-black bg-opacity-40 p-4 rounded-full backdrop-blur-sm">
              <button 
                type="button" 
                onClick={capturePhoto} 
                className="w-20 h-20 bg-white rounded-full border-[6px] border-gray-300 flex items-center justify-center focus:outline-none hover:scale-105 active:scale-95 transition-transform"
              ></button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg">
        <div className="bg-primary-600 text-white p-6 shadow-md md:rounded-b-3xl mb-6 rounded-b-3xl">
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
                  {previews.before ? (
                    <div className="relative h-32 w-full rounded-2xl overflow-hidden group border border-gray-200">
                      <img src={previews.before} className="w-full h-full object-cover" alt="Before" />
                      <button type="button" onClick={() => removeImage('before')} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => startCamera('before')} 
                      className="w-full flex flex-col items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl hover:bg-gray-100 transition-colors group focus:outline-none"
                    >
                      <Camera className="w-8 h-8 text-gray-400 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-gray-500 font-medium tracking-wide group-hover:text-primary-600 transition-colors">TAP TO CAPTURE</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600 text-center">After Cleaning *</label>
                  {previews.after ? (
                    <div className="relative h-32 w-full rounded-2xl overflow-hidden group border border-gray-200">
                      <img src={previews.after} className="w-full h-full object-cover" alt="After" />
                      <button type="button" onClick={() => removeImage('after')} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => startCamera('after')} 
                      className="w-full flex flex-col items-center justify-center h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl hover:bg-gray-100 transition-colors group focus:outline-none"
                    >
                      <Camera className="w-8 h-8 text-primary-400 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-primary-600 font-bold tracking-wide">REQUIRED TAP</span>
                    </button>
                  )}
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
