import { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import initialMockData from '../../data/mockData.json';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import UserFormModal from '../../components/admin/UserFormModal';

const ManageUsersPage = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState(initialMockData.users);
  const [roles] = useState(initialMockData.roles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const getRoleName = (roleId) => roles.find(r => r.role_id === roleId)?.role_name || 'Unknown';

  const usersToDisplay = useMemo(() => {
    const allUsers = users;
    const allRoles = roles;
    
    const roleNameToId = (roleName) => allRoles.find(r => r.role_name === roleName)?.role_id;

    switch (currentUser.role) {
      case 'Super Admin':
      case 'System Admin':
        return allUsers;
      case 'Municipality Admin':
        return allUsers.filter(u => 
          u.municipality_id === currentUser.municipality_id &&
          (u.role_id === roleNameToId('Manager') || u.role_id === roleNameToId('Contractor'))
        );
      default:
        return [];
    }
  }, [currentUser, users, roles]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Note: This only updates the state in the browser.
      setUsers(users.filter(u => u.user_id !== userId));
      console.log(`User with ID ${userId} deleted from state.`);
    }
  };

  const handleSaveUser = (userData) => {
    // Note: This logic is for client-side state management only.
    if (editingUser) {
      // Edit existing user
      setUsers(users.map(u => (u.user_id === userData.user_id ? userData : u)));
      console.log('User updated in state:', userData);
    } else {
      // Add new user
      const newUser = {
        ...userData,
        user_id: Math.max(...users.map(u => u.user_id)) + 1,
        created_at: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
      console.log('New user added to state:', newUser);
    }
  };
  
  const canManageUsers = ['Super Admin', 'System Admin', 'Municipality Admin'].includes(currentUser.role);

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
        />
      )}
    </div>
  );
};

export default ManageUsersPage; 