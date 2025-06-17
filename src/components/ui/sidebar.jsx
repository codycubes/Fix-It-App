import React from 'react';

export const SidebarProvider = ({ children }) => {
  return <>{children}</>;
};

export const Sidebar = ({ children, ...props }) => {
  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200" {...props}>
      {children}
    </div>
  );
};

export const SidebarHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-4 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const SidebarContent = ({ children, ...props }) => {
  return (
    <div className="flex-1 overflow-y-auto py-2" {...props}>
      {children}
    </div>
  );
};

export const SidebarFooter = ({ children, ...props }) => {
  return (
    <div className="p-4 border-t border-gray-200" {...props}>
      {children}
    </div>
  );
};

export const SidebarTrigger = ({ className = '', ...props }) => {
  return (
    <button 
      className={`p-2 rounded-md hover:bg-gray-100 ${className}`} 
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
  );
};

export const SidebarMenu = ({ children, ...props }) => {
  return (
    <ul className="space-y-1" {...props}>
      {children}
    </ul>
  );
};

export const SidebarMenuItem = ({ children, className = '', ...props }) => {
  return (
    <li className={`${className}`} {...props}>
      {children}
    </li>
  );
};

export const SidebarMenuButton = ({ children, asChild, onClick, ...props }) => {
  const Component = asChild ? 'div' : 'button';
  return (
    <Component 
      className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

export const SidebarGroup = ({ children, ...props }) => {
  return (
    <div className="px-3 py-2" {...props}>
      {children}
    </div>
  );
};

export const SidebarGroupLabel = ({ children, ...props }) => {
  return (
    <h3 className="mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide" {...props}>
      {children}
    </h3>
  );
}; 