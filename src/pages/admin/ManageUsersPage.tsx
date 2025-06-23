import React, { useState, useMemo, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useDataStore, { User } from '../../store/useDataStore';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import UserFormModal from '../../components/admin/UserFormModal';

const ManageUsersPage = (): React.ReactElement => {
  const { currentUser, mockData, loading, fetchData, addUser, updateUser, deleteUser } = useDataStore();
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    if (!mockData) {
      fetchData();
    }
  }, [mockData, fetchData]);

  const getRoleName = (roleId: number): string => mockData?.roles.find(r => r.role_id === roleId)?.role_name || 'Unknown';

  const usersToDisplay = useMemo((): User[] => {
    if (!mockData || !currentUser) return [];

    const { users, roles } = mockData;
    
    const roleNameToId = (roleName: string): number | undefined => roles.find(r => r.role_name === roleName)?.role_id;

    switch (currentUser.role) {
      case 'Super Admin':
      case 'System Admin':
        return users;
      case 'Municipality Admin':
        return users.filter(u => 
          u.municipality_id === currentUser.municipality_id &&
          (u.role_id === roleNameToId('Manager') || u.role_id === roleNameToId('Contractor'))
        );
      default:
        return [];
    }
  }, [currentUser, mockData]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  const handleSaveUser = (userData: any) => {
    if (editingUser) {
      updateUser(userData);
    } else {
      addUser(userData);
    }
  };
  
  const canManageUsers = ['Super Admin', 'System Admin', 'Municipality Admin'].includes(currentUser?.role || '');

  if (loading || !currentUser) {
    return <div>Loading...</div>;
  }

  if (!canManageUsers) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="p-8 bg-gray-50/50 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-gray-600 mt-1">Add, edit, or remove user accounts.</p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add User
        </button>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersToDisplay.map(user => (
                <tr key={user.user_id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{getRoleName(user.role_id)}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button onClick={() => handleEditUser(user)} className="p-2 text-blue-600 hover:text-blue-800"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDeleteUser(user.user_id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <UserFormModal
          user={editingUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          roles={mockData.roles}
          municipalities={mockData.municipalities}
        />
      )}
    </div>
  );
};

export default ManageUsersPage; 