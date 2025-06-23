import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, Info, MapPin } from 'lucide-react';
import useDataStore from '../store/useDataStore.ts';

const NewReportPage = (): React.ReactElement => {
    const navigate = useNavigate();
    const { mockData, loading, fetchData, addIssue } = useDataStore();
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [categoryId, setCategoryId] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (!mockData) {
            fetchData();
        }
    }, [fetchData, mockData]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files).slice(0, 5)); // Limit to 5 files
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mockData) return;
        
        setIsSubmitting(true);
        
        addIssue({
            title,
            description,
            location,
            latitude: -26.10, // Dummy data
            longitude: 28.05,  // Dummy data
            category_id: parseInt(categoryId),
        });

        setIsSubmitting(false);
        navigate('/reports');
    };
    
    if (loading || !mockData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-8 bg-gray-50/50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Report an Issue</h1>
                <p className="text-gray-600 mt-1">Report infrastructure problems or issues in your community</p>
            </header>

            <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md mb-8 flex items-start">
                <Info className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                    <h3 className="font-bold">Important</h3>
                    <p className="text-sm">Please provide accurate details to help us address the issue efficiently. Photos help municipal workers identify and fix problems faster.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/80">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Upload Photos</h2>
                    <p className="text-gray-600 text-sm mb-4">Upload photos of the issue to help us understand the problem better</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center hover:border-blue-500 transition-colors">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="font-semibold text-gray-700">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">JPEG, PNG or JPG (MAX. 5MB)</p>
                            <input type="file" multiple onChange={handleFileChange} className="absolute w-full h-full opacity-0 cursor-pointer" />
                        </div>
                        <div className="bg-gray-100 rounded-lg flex items-center justify-center p-2 min-h-[160px]">
                            {files.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {files.map((file, index) => (
                                        <img key={index} src={URL.createObjectURL(file)} alt={`preview ${index}`} className="w-full h-24 object-cover rounded" />
                                    ))}
                                </div>
                            ) : (
                                <Camera className="h-16 w-16 text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200/80 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-bold text-gray-800 mb-1">Issue Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="E.g., Pothole on Main Street"
                            required
                        />
                         <p className="text-xs text-gray-500 mt-1">Provide a brief title describing the issue</p>
                    </div>

                     <div>
                        <label htmlFor="description" className="block text-sm font-bold text-gray-800 mb-1">Description</label>
                        <textarea
                            id="description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Please describe the issue in detail..."
                            required
                        ></textarea>
                         <p className="text-xs text-gray-500 mt-1">Include details like size, severity, how long it's been there, etc.</p>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-bold text-gray-800 mb-1">Category</label>
                        <select
                            id="category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            required
                        >
                            <option value="" disabled>Select a category</option>
                            {mockData.categories.map(cat => (
                                <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Select the category that best describes the issue</p>
                    </div>

                     <div>
                        <label htmlFor="location" className="block text-sm font-bold text-gray-800 mb-1">Location</label>
                        <div className="flex items-center space-x-2">
                           <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Address or location description"
                                required
                            />
                            <button type="button" className="flex-shrink-0 flex items-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-2 px-3 rounded-lg text-sm transition-colors duration-200">
                                <MapPin className="h-4 w-4 mr-2" />
                                Use Current Location
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Enter the address or use your current location</p>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => navigate('/reports')} className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting || loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewReportPage; 