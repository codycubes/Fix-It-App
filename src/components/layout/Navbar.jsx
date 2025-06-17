import React from 'react';
import { ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export const Navbar = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return (
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Welcome</h1>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center">
        {/* Left Side: User Info */}
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Welcome, {currentUser.username}</h1>
          <p className="text-sm text-gray-500">{currentUser.role}</p>
        </div>

        {/* Right Side: User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}; 