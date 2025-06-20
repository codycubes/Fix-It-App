import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import initialMockData from '../../data/mockData.json';
import { ClipboardList, CheckCircle, Hourglass, UserCheck, BarChart2, Briefcase } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200/80">
        <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <Icon className={`h-6 w-6 text-${color}-500`} />
        </div>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
);

const MunicipalityDashboardPage = () => {
    const { currentUser } = useAuth();

    const canViewPage = ['Municipality Admin', 'Manager'].includes(currentUser.role);

    if (!canViewPage) {
        return <Navigate to="/" replace />;
    }
    
    const { issues, categories, users, municipalities } = initialMockData;

    const getMunicipalityName = (municipalityId) => {
        return municipalities.find(m => m.municipality_id === municipalityId)?.name || 'Unknown Municipality';
    }

    const issuesInMunicipality = useMemo(() => 
        issues.filter(issue => issue.municipality_id === currentUser.municipality_id),
        [issues, currentUser.municipality_id]
    );

    const dashboardStats = useMemo(() => {
        const resolved = issuesInMunicipality.filter(i => i.status === 'Resolved');
        const totalResolutionTime = resolved.reduce((acc, i) => {
            const created = new Date(i.created_at).getTime();
            const updated = new Date(i.updated_at).getTime();
            return acc + (updated - created);
        }, 0);
        
        const avgResolutionTimeMs = resolved.length > 0 ? totalResolutionTime / resolved.length : 0;
        const avgDays = Math.floor(avgResolutionTimeMs / (1000 * 60 * 60 * 24));
        const avgHours = Math.floor((avgResolutionTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        const issuesByCategory = categories.map(cat => ({
            name: cat.name,
            count: issuesInMunicipality.filter(i => i.category_id === cat.category_id).length,
        })).sort((a, b) => b.count - a.count);

        const contractors = users.filter(u => u.role_id === 5 && u.municipality_id === currentUser.municipality_id);
        const issuesByContractor = contractors.map(con => ({
            name: con.username,
            count: issuesInMunicipality.filter(i => i.assigned_to === con.user_id).length
        })).sort((a, b) => b.count - a.count);

        return {
            total: issuesInMunicipality.length,
            resolved: resolved.length,
            pending: issuesInMunicipality.filter(i => i.status === 'Pending').length,
            avgResolutionTime: `${avgDays}d ${avgHours}h`,
            issuesByCategory,
            issuesByContractor,
        };
    }, [issuesInMunicipality, categories, users, currentUser.municipality_id]);

    return (
        <div className="p-8 bg-gray-50/50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{getMunicipalityName(currentUser.municipality_id)}</h1>
                <p className="text-gray-600 mt-1">Analytics for issues within your municipality.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Issues" value={dashboardStats.total} icon={ClipboardList} color="blue" />
                <StatCard title="Resolved Issues" value={dashboardStats.resolved} icon={CheckCircle} color="green" />
                <StatCard title="Pending Issues" value={dashboardStats.pending} icon={Hourglass} color="yellow" />
                <StatCard title="Avg. Resolution Time" value={dashboardStats.avgResolutionTime} icon={UserCheck} color="indigo" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><BarChart2 className="w-5 h-5 mr-2" />Issues by Category</h3>
                    <div className="space-y-3">
                        {dashboardStats.issuesByCategory.map(cat => (
                            cat.count > 0 && <div key={cat.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{cat.name}</span>
                                    <span className="text-gray-500">{cat.count}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(cat.count / dashboardStats.total) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                     <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2" />Issues per Contractor</h3>
                     <div className="space-y-3">
                        {dashboardStats.issuesByContractor.map(con => (
                           con.count > 0 && <div key={con.name} className="flex justify-between items-center text-sm">
                               <span className="font-medium text-gray-700">{con.name}</span>
                               <span className="font-semibold text-white bg-indigo-500 rounded-full px-2 py-0.5 text-xs">{con.count}</span>
                           </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MunicipalityDashboardPage; 