import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { Navbar } from './Navbar';

export function AppLayout() {
  return (
    <div className="min-h-screen flex w-full bg-gray-50 ">
      <div className=''>
      <AppSidebar />
      </div>
     
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout; 