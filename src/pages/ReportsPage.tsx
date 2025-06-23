import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDataStore from '../store/useDataStore';

interface ReportCardProps {
    report: any;
    getCategoryName: (categoryId: number) => string;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, getCategoryName }) => {
  const { issue_id, title, description, location, status, status_color, created_at, category_id, image_url } = report;
  const navigate = useNavigate();

  const getStatusDisplay = (status: string): string => {
    if (!status) return '';
    // This will handle "in_progress" to "In Progress"
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-6 flex flex-col justify-between">
      <div className="flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 pr-4">{title}</h3>
          <span 
            className="text-white px-3 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0"
            style={{ backgroundColor: status_color }}
          >
            {getStatusDisplay(status)}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
          <span className="font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md">
            {getCategoryName(category_id)}
          </span>
          <span>•</span>
          <span>{new Date(created_at).toLocaleDateString()}</span>
        </div>
        
        <div className={`flex gap-6 ${image_url ? 'items-start' : 'items-center'}`}>
          <div className="flex-1">
            <p className="text-gray-600 text-sm mb-2">{description}</p>
            <p className="text-gray-500 text-sm font-medium">{location}</p>
          </div>
          {image_url && (
            <div className="w-1/3">
              <img src={image_url} alt={title} className="rounded-lg object-cover w-full aspect-square" />
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button 
          onClick={() => navigate(`/report/${issue_id}`)}
          className="w-full md:w-auto bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
};


const ReportsPage = (): React.ReactElement => {
  const { mockData, loading, fetchData, currentUser } = useDataStore();
  
  useEffect(() => {
    if (!mockData) {
      fetchData();
    }
  }, [mockData, fetchData]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getCategoryName = (categoryId: number): string => {
      if (!mockData) return 'Unknown';
      const category = mockData.categories.find(cat => cat.category_id === categoryId);
      return category ? category.name : 'Unknown';
  };
  
  const getUniqueStatuses = (): { value: string; label: string }[] => {
    const statuses = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
    return statuses.map(status => ({
        value: status.toLowerCase().replace(/\s+/g, '_'),
        label: status
    }));
  };

  const filteredReports = useMemo(() => {
      if (!mockData || !currentUser) return [];

      let reports = mockData.issues;
      
      const isMunicipalityStaff = currentUser.role === 'Municipality Admin' || currentUser.role === 'Manager';

      if (isMunicipalityStaff) {
        reports = reports.filter(issue => issue.municipality_id === currentUser.municipality_id);
      }

      return reports.filter(issue => {
          const statusMatch = selectedStatus === 'all' || issue.status.toLowerCase().replace(/\s+/g, '_') === selectedStatus;
          const categoryMatch = selectedCategory === 'all' || issue.category_id.toString() === selectedCategory;
          const searchMatch = searchTerm === '' || 
              issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              issue.location.toLowerCase().includes(searchTerm.toLowerCase());
          return statusMatch && categoryMatch && searchMatch;
      });
  }, [mockData, selectedStatus, selectedCategory, searchTerm, currentUser]);

  if (loading || !mockData) {
    return <div>Loading...</div>;
  }

  return (
      <div className="p-8 bg-gray-50/50 min-h-screen">
          <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
              <p className="text-gray-600 mt-1">Manage and track all your submitted reports</p>
          </header>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200/80 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                          type="text"
                          placeholder="Search reports..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                  </div>
                  <div>
                      <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      >
                          <option value="all">All Statuses</option>
                          {getUniqueStatuses().map(status => (
                              <option key={status.value} value={status.value}>
                                  {status.label}
                              </option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      >
                          <option value="all">All Categories</option>
                          {mockData.categories.map(category => (
                              <option key={category.category_id} value={category.category_id.toString()}>
                                  {category.name}
                              </option>
                          ))}
                      </select>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredReports.map(report => (
                  <ReportCard key={report.issue_id} report={report} getCategoryName={getCategoryName} />
              ))}
          </div>
      </div>
  );
};

export default ReportsPage; 