import React from 'react';

export const Button = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md w-full"
    >
      {children}
    </button>
  );
};
