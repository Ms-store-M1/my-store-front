import React from 'react';

const Button = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-transparent border border-black text-black font-semibold py-2 px-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
    >
      {children}
    </button>
  );
};

export default Button;
