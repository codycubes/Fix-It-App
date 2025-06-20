import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, User, Clock, Tag, Shield, Edit, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import initialMockData from '../data/mockData.json';
import { formatDistanceToNow, formatDistanceStrict } from 'date-fns';

const statusOptions = [
    { value: 'Pending', color: '#FFD700' },
    { value: 'Assigned', color: '#4169E1' },
    { value: 'In Progress', color: '#FFA500' },
    { value: 'Resolved', color: '#008000' },
    { value: 'Closed', color: '#808080' },
];

const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [issue, setIssue] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const foundIssue = initialMockData.issues.find(i => i.issue_id.toString() === id);
    if (foundIssue) {
        // Ensure status_history exists, if not create a default one
        if (!foundIssue.status_history) {
            foundIssue.status_history = [{ status: foundIssue.status, timestamp: foundIssue.created_at }];
        }
        setIssue(foundIssue);
    }
  }, [id]);

  const getCategoryName = (categoryId) => {
    const category = initialMockData.categories.find(cat => cat.category_id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getMunicipalityName = (municipalityId) => {
    const municipality = initialMockData.municipalities.find(mun => mun.municipality_id === municipalityId);
    return municipality ? municipality.name : 'Unknown';
  };

  const getReporter = (userId) => {
    return initialMockData.users.find(u => u.user_id === userId);
  };

  const getAssignedContractor = (userId) => {
    if (!userId) return null;
    return initialMockData.users.find(u => u.user_id === userId);
  };
  
  const handleAssignContractor = (contractorId) => {
    const updatedIssue = {
        ...issue,
        assigned_to: contractorId,
        status: 'Assigned',
        status_color: statusOptions.find(s => s.value === 'Assigned').color,
        updated_at: new Date().toISOString(),
    };
    setIssue(updatedIssue);
    console.log("Issue assigned and status updated (in state):", updatedIssue);
    alert('Contractor assigned successfully. Issue status is now "Assigned".');
  };

  const handleStatusChange = (newStatus) => {
    const updatedIssue = {
        ...issue,
        status: newStatus,
        status_color: statusOptions.find(s => s.value === newStatus).color,
        updated_at: new Date().toISOString(),
        status_history: [...(issue.status_history || []), { status: newStatus, timestamp: new Date().toISOString() }]
    };
    setIssue(updatedIssue);
    console.log("Issue status updated (in state):", updatedIssue);
  };
  
  const handlePriorityChange = (newPriority) => {
      setIssue({...issue, priority: newPriority});
      console.log("Issue priority updated (in state) to:", newPriority);
  };

  const contractors = initialMockData.users.filter(user => user.role_id === 5 && user.municipality_id === issue?.municipality_id);

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Report not found</h2>
        <p className="text-gray-600 mb-6">The report you are looking for does not exist or you do not have permission to view it.</p>
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
  
  const canManageIssue = (currentUser.role === 'Municipality Admin' || currentUser.role === 'Manager') 
    && currentUser.municipality_id === issue.municipality_id;

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
                {issue.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
              <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                  <button 
                    onClick={() => setActiveTab('details')}
                    className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Details
                  </button>
                   <button 
                    onClick={() => setActiveTab('activity')}
                    className={`py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'activity' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Activity
                  </button>
                </nav>
              </div>

              {/* Details Content */}
              {activeTab === 'details' && (
                <>
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
                </>
              )}

              {/* Activity Content */}
              {activeTab === 'activity' && (
                <ActivityTimeline issue={issue} />
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/80">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Status & Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600 flex items-center"><Clock className="w-4 h-4 mr-2 text-gray-400"/>Current Status</span>
                <span 
                  className="text-white px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: issue.status_color }}
                >
                  {issue.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-600 flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400"/>Municipality</span>
                <span className="text-gray-800 font-medium">{getMunicipalityName(issue.municipality_id)}</span>
              </div>
              {['Assigned', 'In Progress', 'Resolved'].includes(issue.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')) && assignedContractor && (
                <div className="flex justify-between text-sm pt-3 mt-3 border-t border-gray-100">
                  <span className="font-medium text-gray-600 flex items-center"><User className="w-4 h-4 mr-2 text-gray-400"/>Assigned To</span>
                  <span className="text-gray-800 font-medium">{assignedContractor.username}</span>
                </div>
              )}
            </div>
             {canManageIssue ? (
              <>
                <div className="mt-4 pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                    <select onChange={(e) => handleStatusChange(e.target.value)} value={issue.status} className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm">
                        {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.value}</option>)}
                    </select>
                </div>
                <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Update Priority</label>
                    <select onChange={(e) => handlePriorityChange(e.target.value)} value={issue.priority} className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm">
                        {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
              </>
             ) : (
                <div className="flex justify-between text-sm pt-3 mt-3 border-t border-gray-100">
                  <span className="font-medium text-gray-600 flex items-center"><Shield className="w-4 h-4 mr-2 text-gray-400"/>Priority</span>
                  <span className="text-gray-800 font-medium">{issue.priority}</span>
                </div>
             )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200/80">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Contractors</h3>
            {canManageIssue && issue.status === 'Pending' ? (
                <div className="space-y-3">
                    <p className="text-sm text-gray-500 mb-3">Assign a contractor to this issue.</p>
                    {contractors.length > 0 ? (
                        contractors.map(contractor => (
                        <div key={contractor.user_id} className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-sm text-gray-800">{contractor.username}</p>
                                <p className="text-xs text-gray-500">{contractor.email}</p>
                            </div>
                            <button onClick={() => handleAssignContractor(contractor.user_id)} className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold text-xs py-1 px-3 rounded-full">
                                Assign
                            </button>
                        </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No contractors available in this municipality.</p>
                    )}
                </div>
            ) : assignedContractor ? (
                 <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm">
                      {assignedContractor.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{assignedContractor.username}</p>
                      <p className="text-xs text-gray-500">Assigned Contractor</p>
                    </div>
                  </div>
            ) : (
                 <p className="text-sm text-gray-500">No contractor assigned.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityTimeline = ({ issue }) => {
    const allStatuses = ["Pending", "Assigned", "In Progress", "Resolved", "Closed"];

    const getDuration = (startDate, endDate) => {
        return formatDistanceStrict(new Date(startDate), new Date(endDate));
    }
    
    // Calculate total open time
    const totalOpenTime = issue.status !== "Closed" 
        ? formatDistanceToNow(new Date(issue.created_at), { includeSeconds: true })
        : getDuration(issue.created_at, issue.status_history.find(h => h.status === "Closed").timestamp);

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-base font-bold text-gray-800">Total Time Open</h3>
                <p className="text-sm text-gray-600">{totalOpenTime}</p>
            </div>
            <ol className="relative border-l-2 border-gray-200/80">
                {allStatuses.map((status, index) => {
                    const historyEntry = issue.status_history.find(h => h.status === status);
                    const isCompleted = issue.status_history.some(h => h.status === status);
                    const nextHistoryEntry = allStatuses[index+1] ? issue.status_history.find(h => h.status === allStatuses[index+1]) : null;
                    
                    let durationAtStage = null;
                    if(isCompleted && nextHistoryEntry) {
                        durationAtStage = getDuration(historyEntry.timestamp, nextHistoryEntry.timestamp);
                    } else if (isCompleted && issue.status === status && status !== 'Closed') {
                         durationAtStage = `Ongoing for ${formatDistanceToNow(new Date(historyEntry.timestamp))}`;
                    }

                    return (
                        <li key={status} className="mb-10 ml-8">
                            <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                               {isCompleted ? <CheckCircle2 size={20}/> : <span className="text-sm font-bold">{index+1}</span>}
                            </span>
                            <div className="ml-2">
                                <h3 className="font-bold text-gray-900">{status}</h3>
                                {isCompleted ? (
                                    <>
                                        <time className="block text-sm font-normal leading-none text-gray-400">
                                            {new Date(historyEntry.timestamp).toLocaleString()}
                                        </time>
                                        {durationAtStage && <p className="mt-1 text-xs text-gray-500">Time in stage: {durationAtStage}</p>}
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-400">Pending</p>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ol>
        </div>
    );
};

export default ReportDetailPage; 