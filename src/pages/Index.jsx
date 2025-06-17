import { ClipboardList, Hourglass, Hammer, CheckCircle, ShieldX } from 'lucide-react';
import mockData from '../data/mockData.json';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200/80 flex items-center space-x-4">
    <div className={`p-3 rounded-full`} style={{ backgroundColor: `${color}1A`}}>
      <Icon className="h-6 w-6" style={{ color: color }} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);


const Index = () => {
  const issues = mockData.issues;

  const totalReports = issues.length;
  const pendingReports = issues.filter(issue => issue.status === 'Pending').length;
  const inProgressReports = issues.filter(issue => issue.status === 'In Progress').length;
  const closedReports = issues.filter(issue => issue.status === 'Closed').length;

  return (
    <div className="p-8 bg-gray-50/50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          An overview of all municipal reports and their current statuses.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Reports" value={totalReports} icon={ClipboardList} color="#3B82F6" />
        <StatCard title="Pending Reports" value={pendingReports} icon={Hourglass} color="#F59E0B" />
        <StatCard title="In Progress" value={inProgressReports} icon={Hammer} color="#8B5CF6" />
        <StatCard title="Closed Reports" value={closedReports} icon={ShieldX} color="#808080" />
      </div>
    </div>
  );
};

export default Index; 