import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import CleanerFormPage from './pages/CleanerFormPage';
import AdminDashboard from './pages/AdminDashboard';
import CleaningLogsPage from './pages/CleaningLogsPage';

function App() {
  return (
    <Router>
      <div className="h-screen w-full bg-gray-50 overflow-hidden">
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          {/* Cleaner Mobile View */}
          <Route path="/" element={
            <div className="h-full w-full overflow-y-auto">
              <CleanerFormPage />
            </div>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <div className="flex flex-row h-full w-full overflow-hidden">
              <Sidebar />
              <div className="flex-1 overflow-y-auto bg-gray-100">
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="logs" element={<CleaningLogsPage />} />
                  <Route path="cleaners" element={<div className="p-8"><h2>Cleaners Page (Coming Soon)</h2></div>} />
                </Routes>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
