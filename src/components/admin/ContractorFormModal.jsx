import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ContractorFormModal = ({ contractor, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (contractor) {
      setFormData({
        username: contractor.username,
        email: contractor.email,
        password: ''
      });
    }
  }, [contractor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (contractor) {
      payload.user_id = contractor.user_id;
    }
    if (!payload.password && !contractor) {
        alert('Password is required for new contractors.');
        return;
    }
    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{contractor ? 'Edit Contractor' : 'Add New Contractor'}</h2>
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
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder={contractor ? "Leave blank to keep unchanged" : ""} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="pt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg">Cancel</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">Save Contractor</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractorFormModal; 