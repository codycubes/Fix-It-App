import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define interfaces for our data models
interface Issue {
  issue_id: number;
  user_id: number;
  category_id: number;
  municipality_id: number;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  status: string;
  status_color: string;
  priority: string;
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
  image_url: string;
  status_history?: { status: string; timestamp: string }[];
}

interface User {
  user_id: number;
  username: string;
  email: string;
  password_hash?: string;
  role_id: number;
  municipality_id: number | null;
  corporation_id: number | null;
  created_at: string;
  role?: string;
}

interface Role {
    role_id: number;
    role_name: string;
}

interface Municipality {
    municipality_id: number;
    name: string;
    location: string;
    blue_machine_id: number;
}

interface Category {
    category_id: number;
    name: string;
}

interface Contractor {
    contractor_id: number;
    user_id: number;
}

interface MockData {
  issues: Issue[];
  users: User[];
  roles: Role[];
  municipalities: Municipality[];
  categories: Category[];
  contractors: Contractor[];
  currentUser: User;
}

// Define the store's state and actions
interface DataStore {
  mockData: MockData | null;
  loading: boolean;
  currentUser: User | null;
  fetchData: () => Promise<void>;
  addIssue: (newIssue: Omit<Issue, 'issue_id' | 'created_at' | 'updated_at' | 'user_id' | 'municipality_id' | 'status' | 'status_color' | 'priority' | 'assigned_to' | 'image_url'>) => void;
  updateIssue: (issueId: number, updates: Partial<Issue>) => void;
  addUser: (userData: Omit<User, 'user_id' | 'created_at' | 'role_id' | 'municipality_id' | 'corporation_id'>) => void;
  updateUser: (userData: User) => void;
  deleteUser: (userId: number) => void;
  addContractor: (contractorData: Omit<User, 'user_id' | 'created_at' | 'role_id' | 'municipality_id' | 'corporation_id'>) => void;
  updateContractor: (contractorData: User) => void;
  deleteContractor: (userId: number) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'user_id' | 'created_at' | 'role_id' | 'municipality_id' | 'corporation_id'>) => boolean;
  isAuthenticated: () => boolean;
}

const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      mockData: null,
      loading: true,
      currentUser: null,
      
      fetchData: async () => {
        try {
          if (!get().mockData) {
            const data = await import('../data/mockData.json');
            set({ mockData: data.default, loading: false });
          }
        } catch (error) {
          console.error("Failed to fetch mock data", error);
          set({ loading: false });
        }
      },

      addIssue: (newIssue) => set((state) => {
        if (!state.mockData || !state.currentUser) return {};
        
        const newId = Math.max(...state.mockData.issues.map(i => i.issue_id)) + 1;
        const issueToAdd: Issue = {
            ...newIssue,
            issue_id: newId,
            user_id: state.currentUser.user_id,
            municipality_id: state.currentUser.municipality_id!,
            status: "Pending",
            status_color: "#FFD700",
            priority: "Medium",
            assigned_to: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            image_url: `https://picsum.photos/seed/report${newId}/800/600`
        };

        const newIssues = [...state.mockData.issues, issueToAdd];
        const updatedData = {
            ...state.mockData,
            issues: newIssues
        };

        console.log("Updated mockData object:", updatedData);
        alert('New issue has been created and logged to the console. Please manually update mockData.json to persist this change.');
        
        return { mockData: updatedData };
      }),

      updateIssue: (issueId, updates) => set((state) => {
        if (!state.mockData) return {};
        
        const updatedIssues = state.mockData.issues.map(issue => 
          issue.issue_id === issueId ? { ...issue, ...updates, updated_at: new Date().toISOString() } : issue
        );

        const updatedData = {
          ...state.mockData,
          issues: updatedIssues
        };

        console.log(`Issue ${issueId} updated (in memory):`, updates);
        
        return { mockData: updatedData };
      }),

      login: (email, password) => {
        const { mockData } = get();
        if (!mockData) return false;
        
        const user = mockData.users.find(u => u.email === email);
        if (user) {
            const userWithRole = {
                ...user,
                role: mockData.roles.find(r => r.role_id === user.role_id)?.role_name || 'User'
            };
            set({ currentUser: userWithRole });
            return true;
        }
        return false;
      },

      logout: () => set({ currentUser: null }),

      register: ({ username, email, password }) => {
        const { mockData } = get();
        if (!mockData) {
            return false;
        }
        const userExists = mockData.users.some(u => u.email === email);
        if (userExists) {
            alert('A user with this email already exists.');
            return false;
        }

        const newUser: User = {
            user_id: Math.max(...mockData.users.map(u => u.user_id)) + 1,
            username,
            email,
            password_hash: 'dummy_hash',
            role_id: 6,
            municipality_id: 1,
            corporation_id: 1,
            created_at: new Date().toISOString()
        };
        
        const updatedUsers = [...mockData.users, newUser];
        
        set(state => ({
            mockData: { ...state.mockData, users: updatedUsers }
        }));

        console.log("New user registered (in memory):", newUser);
        console.log("Updated users list (in memory):", updatedUsers);
        
        alert('Registration successful! Please log in.');
        return true;
      },

      isAuthenticated: () => !!get().currentUser,

      addUser: (userData) => set((state) => {
        if (!state.mockData) return {};
        const newUser: User = {
          ...userData,
          user_id: Math.max(...state.mockData.users.map(u => u.user_id)) + 1,
          created_at: new Date().toISOString(),
          role_id: 6,
          municipality_id: 1,
          corporation_id: 1,
        };
        const updatedUsers = [...state.mockData.users, newUser];
        console.log('New user added:', newUser);
        return {
          mockData: { ...state.mockData, users: updatedUsers }
        };
      }),

      updateUser: (userData) => set((state) => {
        if (!state.mockData) return {};
        const updatedUsers = state.mockData.users.map(u => u.user_id === userData.user_id ? userData : u);
        console.log('User updated:', userData);
        return {
          mockData: { ...state.mockData, users: updatedUsers }
        };
      }),

      addContractor: (contractorData) => set((state) => {
        if (!state.mockData || !state.currentUser) return {};
        const newUserId = Math.max(...state.mockData.users.map(u => u.user_id)) + 1;
        const newUser: User = {
          ...contractorData,
          user_id: newUserId,
          role_id: 5, // Contractor
          municipality_id: state.currentUser.municipality_id,
          created_at: new Date().toISOString(),
          corporation_id: 1,
        };
        const newContractor: Contractor = {
          contractor_id: Math.max(...state.mockData.contractors.map(c => c.contractor_id)) + 1,
          user_id: newUserId,
        };
        const updatedUsers = [...state.mockData.users, newUser];
        const updatedContractors = [...state.mockData.contractors, newContractor];
        return {
            mockData: { ...state.mockData, users: updatedUsers, contractors: updatedContractors }
        };
      }),

      updateContractor: (contractorData) => set((state) => {
        if (!state.mockData) return {};
        const updatedUsers = state.mockData.users.map(u => u.user_id === contractorData.user_id ? { ...u, ...contractorData } : u);
        return {
          mockData: { ...state.mockData, users: updatedUsers }
        };
      }),

      deleteContractor: (userId) => set((state) => {
        if (!state.mockData) return {};
        const updatedUsers = state.mockData.users.filter(u => u.user_id !== userId);
        const updatedContractors = state.mockData.contractors.filter(c => c.user_id !== userId);
        return {
          mockData: { ...state.mockData, users: updatedUsers, contractors: updatedContractors }
        };
      }),

      deleteUser: (userId) => set((state) => {
        if (!state.mockData) return {};
        const updatedUsers = state.mockData.users.filter(u => u.user_id !== userId);
        console.log(`User with ID ${userId} deleted.`);
        return {
          mockData: { ...state.mockData, users: updatedUsers }
        };
      }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);

export default useDataStore;
