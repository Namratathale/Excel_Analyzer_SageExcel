import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex flex-col items-center text-center">
      <svg width="60" height="60" viewBox="0 0 100 100" className="mb-2">
        {/* Outer Circle */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" className="text-gray-300 dark:text-teal-400" />
        {/* Inner Icon Elements */}
        <path d="M30 40 H55 L65 30 L55 40 V50 H30 Z" stroke="currentColor" strokeWidth="3" fill="none" className="text-white" />
        <rect x="30" y="55" width="8" height="15" fill="currentColor" className="text-white" />
        <rect x="42" y="60" width="8" height="10" fill="currentColor" className="text-white" />
        <rect x="54" y="52" width="8" height="18" fill="currentColor" className="text-white" />
        <circle cx="70" cy="60" r="10" stroke="currentColor" strokeWidth="3" fill="none" className="text-white" />
      </svg>
      <h1 className="text-2xl font-bold tracking-wider text-white">
        SAGEEXCEL
      </h1>
      <p className="text-xs font-light text-gray-300">
        From Spreadsheet to Story
      </p>
    </Link>
  );
};

export default Logo;