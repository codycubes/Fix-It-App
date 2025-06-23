import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = (): React.ReactElement => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="text-xl font-medium text-gray-600 mb-8">Page Not Found</p>
            <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Go back to Home
            </Link>
        </div>
    );
};

export default NotFound; 