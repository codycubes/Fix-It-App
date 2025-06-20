import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { Navbar } from './Navbar';

export function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50/50">
      <div className="fixed inset-y-0 left-0 z-30">
        <AppSidebar />
      </div>
      
      <div className="flex-1 flex flex-col pl-64">
        <div className="fixed top-0 left-64 right-0 z-20">
            <Navbar />
        </div>
        <main className="flex-1 pt-20">
          <div className="p-8 h-full overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout; 