import React from 'react';

const buttonVariants = {
  default: 'bg-blue-600 hover:bg-blue-700 text-white',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
  ghost: 'hover:bg-gray-100 text-gray-700',
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
};

export const Button = ({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantClasses = buttonVariants[variant] || buttonVariants.default;
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}; 