import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Clock, Tag, ShieldCheck } from 'lucide-react';
import mockData from '../data/mockData.json';

const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const issue = mockData.issues.find(i => i.issue_id.toString() === id);
  
  const getCategoryName = (categoryId) => {
    const category = mockData.categories.find(cat => cat.category_id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getMunicipalityName = (municipalityId) => {
    const municipality = mockData.municipalities.find(mun => mun.municipality_id === municipalityId);
    return municipality ? municipality.name : 'Unknown';
  };

  const getAssignedContractor = (userId) => {
    if (!userId) return null;
    return mockData.users.find(u => u.user_id === userId);
  };

  const getStatusDisplay = (status) => {
    if (!status) return '';
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const getReporter = (userId) => {
    return mockData.users.find(u => u.user_id === userId);
  };

  const contractors = mockData.users.filter(user => user.role_id === 5);

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Report not found</h2>
        <p className="text-gray-600 mb-6">The report you are looking for does not exist.</p>
        <button
          onClick={() => navigate('/reports')}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 hover:bg-blue-700 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </button>
      </div>
    );
  }

  const reporter = getReporter(issue.reported_by);
  const assignedContractor = getAssignedContractor(issue.assigned_to);

  return (
    <div className="p-8 bg-gray-50/50 min-h-screen">
      {/* Header with Breadcrumbs and Back Button */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <nav className="text-sm font-medium text-gray-500 flex items-center space-x-2">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <span>›</span>
            <Link to="/reports" className="hover:text-gray-700">Reports</Link>
            <span>›</span>
            <span className="text-gray-700 truncate max-w-xs">{issue.title}</span>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
           <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{issue.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span 
                className="text-white px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                style={{ backgroundColor: issue.status_color }}
              >
                {getStatusDisplay(issue.status)}
              </span>
              <span>{getCategoryName(issue.category_id)}</span>
              <span>Reported on {new Date(issue.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Issue Details</h2>
              {/* Tabs */}
              {/* <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                  <button className="py-3 px-1 border-b-2 border-blue-600 text-blue-600 font-semibold text-sm">
                    Details
                  </button>
                   <button className="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm">
                    Activity
                  </button>
                </nav>
              </div> */}

              {/* Details Content */}
              {issue.image_url && (
                <img src={issue.image_url} alt={issue.title} className="rounded-lg object-cover w-full max-h-80 mb-6 border border-gray-200" />
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 text-sm">{issue.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center"><Tag className="w-4 h-4 mr-2 text-gray-500"/>Category</h3>
                    <p className="text-gray-600 text-sm">{getCategoryName(issue.category_id)}</p>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-500"/>Location</h3>
                    <p className="text-gray-600 text-sm">{issue.location}</p>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center"><User className="w-4 h-4 mr-2 text-gray-500"/>Reported By</h3>
                    <p className="text-gray-600 text-sm">{reporter ? reporter.username : 'Unknown User'}</p>
                  </div>
                   <div>
                    <h3 className="text-base font-bold text-gray-800 mb-2 flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-500"/>Reported On</h3>
                    <p className="text-gray-600 text-sm">{new Date(issue.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/80">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600 flex items-center"><Clock className="w-4 h-4 mr-2 text-gray-400"/>Current Status</span>
                <span 
                  className="text-white px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: issue.status_color }}
                >
                  {getStatusDisplay(issue.status)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600 flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400"/>Municipality</span>
                <span className="text-gray-800 font-medium">{getMunicipalityName(issue.municipality_id)}</span>
              </div>
              {['Assigned', 'In Progress', 'Resolved'].includes(getStatusDisplay(issue.status)) && assignedContractor && (
                <div className="flex justify-between text-sm pt-3 mt-3 border-t border-gray-100">
                  <span className="font-medium text-gray-600 flex items-center"><User className="w-4 h-4 mr-2 text-gray-400"/>Assigned To</span>
                  <span className="text-gray-800 font-medium">{assignedContractor.username}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/80">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Available Contractors</h3>
            <div className="space-y-3">
              {contractors.length > 0 ? (
                contractors.map(contractor => (
                  <div key={contractor.user_id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm">
                      {contractor.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{contractor.username}</p>
                      <p className="text-xs text-gray-500">{contractor.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No contractors available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage; 