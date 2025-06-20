import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import initialMockData from '../../data/mockData.json';
import { X } from 'lucide-react';

const UserFormModal = ({ user, onClose, onSave }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role_id: '',
    municipality_id: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        municipality_id: user.municipality_id || '',
        password: '' // Password should not be pre-filled
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (user) {
      payload.user_id = user.user_id;
    }
    if (!payload.password && !user) {
        alert('Password is required for new users.');
        return;
    }
    onSave(payload);
    onClose();
  };

  const availableRoles = useMemo(() => {
    const allRoles = initialMockData.roles;
    switch (currentUser.role) {
      case 'Super Admin':
      case 'System Admin':
        return allRoles;
      case 'Municipality Admin':
        return allRoles.filter(r => r.role_name === 'Manager' || r.role_name === 'Contractor');
      default:
        return [];
    }
  }, [currentUser.role]);
  
  const municipalities = initialMockData.municipalities;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{user ? 'Edit User' : 'Add New User'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={user ? "Leave blank to keep unchanged" : ""} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select name="role_id" value={formData.role_id} onChange={handleChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
              <option value="" disabled>Select a role</option>
              {availableRoles.map(role => (
                <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
              ))}
            </select>
          </div>
          {formData.role_id && availableRoles.find(r => r.role_id == formData.role_id)?.role_name !== 'Super Admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Municipality</label>
              <select name="municipality_id" value={formData.municipality_id} onChange={handleChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                <option value="" disabled>Select a municipality</option>
                {municipalities.map(m => (
                    <option key={m.municipality__id} value={m.municipality_id}>{m.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="pt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">Save User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal; 