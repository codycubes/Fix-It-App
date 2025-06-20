import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import initialMockData from '../data/mockData.json';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [mockData, setMockData] = useState(initialMockData);
    const [isInitialized, setIsInitialized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate checking for a logged-in user in session storage
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setIsInitialized(true);
    }, []);

    const login = (email, password) => {
        const user = mockData.users.find(u => u.email === email);
        if (user) {
            //  Here we accept any password.
            const userWithRole = {
                ...user,
                // Assign role name based on role_id
                role: mockData.roles.find(r => r.role_id === user.role_id)?.role_name || 'User'
            };
            setCurrentUser(userWithRole);
            sessionStorage.setItem('currentUser', JSON.stringify(userWithRole));
            navigate('/');
            return true;
        }
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem('currentUser');
        navigate('/login');
    };

    const register = ({ username, email, password }) => {
        const userExists = mockData.users.some(u => u.email === email);
        if (userExists) {
            alert('A user with this email already exists.');
            return false;
        }

        const newUser = {
            user_id: Math.max(...mockData.users.map(u => u.user_id)) + 1,
            username,
            email,
            // In a real app, you would hash the password
            password_hash: 'dummy_hash', 
            role_id: 6, // Default role: User
            municipality_id: 1, // Default municipality
            corporation_id: 1,
            created_at: new Date().toISOString()
        };
        
        // This is a simulation. In a real app, an API call would handle this.
        // For now, it won't persist in the actual mockData.json file.
        const updatedUsers = [...mockData.users, newUser];
        setMockData({ ...mockData, users: updatedUsers });

        console.log("New user registered (in memory):", newUser);
        console.log("Updated users list (in memory):", updatedUsers);
        
        alert('Registration successful! Please log in.');
        navigate('/login');
        return true;
    };

    const value = {
        currentUser,
        login,
        logout,
        register,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {isInitialized ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    );
}; 