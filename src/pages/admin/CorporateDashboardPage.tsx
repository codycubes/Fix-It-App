import React, { useMemo, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useDataStore from '../../store/useDataStore';
import { ClipboardList, CheckCircle, Hourglass, BarChart2, Briefcase, Building } from 'lucide-react';
import { formatDistanceStrict } from 'date-fns';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200/80">
        <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <Icon className={`h-6 w-6 text-${color}-500`} />
        </div>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
);

const CorporateDashboardPage = (): React.ReactElement => {
    const { currentUser, mockData, loading, fetchData } = useDataStore();

    useEffect(() => {
        if (!mockData) {
          fetchData();
        }
    }, [mockData, fetchData]);

    const dashboardStats = useMemo(() => {
        if (!mockData) return null;

        const { issues, municipalities } = mockData;
        const totalIssues = issues.length;
        const resolvedIssues = issues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
        const pendingIssues = issues.filter(i => i.status === 'Pending' || i.status === 'In Progress' || i.status === 'Assigned').length;

        const issuesByMunicipality = municipalities.map(m => {
            const municipalityIssues = issues.filter(i => i.municipality_id === m.municipality_id);
            const resolvedInMunicipality = municipalityIssues.filter(i => i.status === 'Resolved' || i.status === 'Closed');

            const totalResolutionTime = resolvedInMunicipality.reduce((acc, i) => {
                const created = new Date(i.created_at).getTime();
                const updated = new Date(i.status_history.find(h => h.status === 'Resolved' || h.status === 'Closed')?.timestamp || i.updated_at).getTime();
                return acc + (updated - created);
            }, 0);
            
            const avgResolutionTimeMs = resolvedInMunicipality.length > 0 ? totalResolutionTime / resolvedInMunicipality.length : 0;
            
            let avgResolutionTime = 'N/A';
            if (avgResolutionTimeMs > 0) {
                 avgResolutionTime = formatDistanceStrict(0, avgResolutionTimeMs, { unit: 'day' });
            }

            return {
                id: m.municipality_id,
                name: m.name,
                total: municipalityIssues.length,
                resolved: resolvedInMunicipality.length,
                pending: municipalityIssues.length - resolvedInMunicipality.length,
                avgResolutionTime,
            };
        });

        return {
            totalIssues,
            resolvedIssues,
            pendingIssues,
            issuesByMunicipality,
        };
    }, [mockData]);

    if (loading || !currentUser || !dashboardStats) {
        return <div>Loading...</div>;
    }

    if (!currentUser.role || !['Super Admin', 'System Admin'].includes(currentUser.role)) {
        return <Navigate to="/" replace />;
    }
    
    return (
        <div className="p-8 bg-gray-50/50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Corporate Dashboard</h1>
                <p className="text-gray-600 mt-1">High-level overview of all municipalities.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Issues Reported" value={dashboardStats.totalIssues} icon={ClipboardList} color="blue" />
                <StatCard title="Total Issues Resolved" value={dashboardStats.resolvedIssues} icon={CheckCircle} color="green" />
                <StatCard title="Total Pending Issues" value={dashboardStats.pendingIssues} icon={Hourglass} color="yellow" />
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Building className="w-5 h-5 mr-2" />Municipality Metrics</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Municipality</th>
                                <th scope="col" className="px-6 py-3 text-center">Total Issues</th>
                                <th scope="col" className="px-6 py-3 text-center">Resolved</th>
                                <th scope="col" className="px-6 py-3 text-center">Pending</th>
                                <th scope="col" className="px-6 py-3 text-center">Avg. Resolution Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardStats.issuesByMunicipality.map(m => (
                                <tr key={m.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{m.name}</td>
                                    <td className="px-6 py-4 text-center">{m.total}</td>
                                    <td className="px-6 py-4 text-center">{m.resolved}</td>
                                    <td className="px-6 py-4 text-center">{m.pending}</td>
                                    <td className="px-6 py-4 text-center">{m.avgResolutionTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CorporateDashboardPage; 