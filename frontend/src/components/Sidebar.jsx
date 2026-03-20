import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Users } from 'lucide-react';
import clsx from 'clsx';

function Sidebar() {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Cleaning Logs', path: '/admin/logs', icon: ClipboardList },
    { name: 'Cleaners', path: '/admin/cleaners', icon: Users },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary-600">Azzurro</h2>
        <p className="text-sm text-gray-500">Admin Dashboard</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Back to Cleaner Form
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
