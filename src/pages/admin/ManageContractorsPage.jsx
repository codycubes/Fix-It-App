import { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import initialMockData from '../../data/mockData.json';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import ContractorFormModal from '../../components/admin/ContractorFormModal';

const ManageContractorsPage = () => {
  const { currentUser } = useAuth();
  const [mockData, setMockData] = useState(initialMockData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContractor, setEditingContractor] = useState(null);

  const contractors = useMemo(() => {
    const isAllowed = currentUser?.role === 'Municipality Admin' || currentUser?.role === 'Manager';
    if (!currentUser || !isAllowed) {
      return [];
    }
    const contractorUserIds = mockData.contractors.map(c => c.user_id);
    return mockData.users.filter(user => 
      user.role_id === 5 && // Role ID for Contractor
      user.municipality_id === currentUser.municipality_id &&
      contractorUserIds.includes(user.user_id)
    );
  }, [currentUser, mockData]);

  const handleAddContractor = () => {
    setEditingContractor(null);
    setIsModalOpen(true);
  };

  const handleEditContractor = (contractor) => {
    setEditingContractor(contractor);
    setIsModalOpen(true);
  };

  const handleDeleteContractor = (userId) => {
    if (window.confirm('Are you sure you want to delete this contractor?')) {
      const newUsers = mockData.users.filter(u => u.user_id !== userId);
      const newContractors = mockData.contractors.filter(c => c.user_id !== userId);
      setMockData({ ...mockData, users: newUsers, contractors: newContractors });
    }
  };

  const handleSaveContractor = (contractorData) => {
    if (editingContractor) {
      const updatedUsers = mockData.users.map(u => 
        u.user_id === contractorData.user_id ? { ...u, ...contractorData } : u
      );
      setMockData({ ...mockData, users: updatedUsers });
    } else {
      const newUserId = Math.max(...mockData.users.map(u => u.user_id)) + 1;
      const newUser = {
        ...contractorData,
        user_id: newUserId,
        role_id: 5, // Contractor
        municipality_id: currentUser.municipality_id,
        created_at: new Date().toISOString(),
      };
      const newContractor = {
        contractor_id: Math.max(...mockData.contractors.map(c => c.contractor_id)) + 1,
        user_id: newUserId,
      };
      setMockData({ 
        ...mockData, 
        users: [...mockData.users, newUser],
        contractors: [...mockData.contractors, newContractor]
      });
    }
  };

  const canManageContractors = ['Municipality Admin', 'Manager'].includes(currentUser?.role);

  if (!canManageContractors) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="p-8 bg-gray-50/50 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Contractors</h1>
          <p className="text-gray-600 mt-1">Add, edit, or remove contractors for your municipality.</p>
        </div>
        <button
          onClick={handleAddContractor}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Contractor
        </button>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contractors.map(contractor => (
                <tr key={contractor.user_id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{contractor.username}</td>
                  <td className="px-6 py-4">{contractor.email}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button onClick={() => handleEditContractor(contractor)} className="p-2 text-blue-600 hover:text-blue-800"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDeleteContractor(contractor.user_id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ContractorFormModal
          contractor={editingContractor}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveContractor}
        />
      )}
    </div>
  );
};

export default ManageContractorsPage; 