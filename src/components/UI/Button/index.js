import React from 'react';

const Button = ({ children, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-transparent border border-black text-black font-semibold py-2 px-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
    >
      {children}
    </button>
  );
};

export default Button;
