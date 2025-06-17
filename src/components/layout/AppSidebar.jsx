import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  ClipboardList,
  FileSpreadsheet,
  Home,
  Map,
  MapPinned,
  PlusCircle,
  Settings,
  Users2,
} from 'lucide-react';

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const isActive = (path) => location.pathname === path;
  
  if (!currentUser) {
    // Or a loading spinner, or some placeholder
    return null;
  }
  
  const isAdmin = currentUser.role === 'Admin' || currentUser.role === 'Super Admin' || currentUser.role === 'System Admin' || currentUser.role === 'Municipality Admin' || currentUser.role === 'Manager' || currentUser.role === 'Contractor';

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <MapPinned className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Fix It Up</h2>
            <p className="text-xs text-gray-500 font-medium">Municipal Reporting System</p>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-1">
          <nav className="space-y-1">
            <button 
              onClick={() => navigate('/')} 
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              <span>Dashboard</span>
            </button>
            
            <button 
              onClick={() => navigate('/reports')} 
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive('/reports') 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ClipboardList className="h-5 w-5 mr-3" />
              <span>Reports</span>
            </button>
            
            <button 
              onClick={() => navigate('/map')} 
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive('/map') 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Map className="h-5 w-5 mr-3" />
              <span>Map View</span>
            </button>
            
            <button 
              onClick={() => navigate('/report/new')} 
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <PlusCircle className="h-5 w-5 mr-3" />
              <span>New Report</span>
            </button>
          </nav>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Administration
            </h3>
            <nav className="space-y-1">
              <button 
                onClick={() => navigate('/admin/dashboard')} 
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive('/admin/dashboard') 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FileSpreadsheet className="h-5 w-5 mr-3" />
                <span>Admin Dashboard</span>
              </button>
              
              <button 
                onClick={() => navigate('/admin/assignments')} 
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive('/admin/assignments') 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Users2 className="h-5 w-5 mr-3" />
                <span>Assignments</span>
              </button>
              
              <button 
                onClick={() => navigate('/admin/analytics')} 
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive('/admin/analytics') 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                <span>Analytics</span>
              </button>
            </nav>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button 
          onClick={() => navigate('/settings')} 
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
        >
          <Settings className="h-5 w-5 mr-3" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
} 