import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaTachometerAlt, FaChartBar, FaRobot, FaHistory, FaFileUpload, FaUserShield } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Logo from './Logo'; // Import the new Logo component

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-black/30 text-white'
        : 'text-indigo-100 hover:bg-black/20 hover:text-white'
    }`;

  return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-indigo-600 dark:bg-gradient-to-b dark:from-gray-900 dark:to-slate-800">
      <div className="mb-10">
        <Logo />
      </div>
      <div className="flex flex-col justify-between flex-1">
        <nav className="space-y-2">
          <motion.div whileHover={{ scale: 1.05 }}><NavLink to="/" className={navLinkClasses} end> <FaTachometerAlt className="mr-3" /> Dashboard </NavLink></motion.div>
          <motion.div whileHover={{ scale: 1.05 }}><NavLink to="/upload" className={navLinkClasses}> <FaFileUpload className="mr-3" /> Upload </NavLink></motion.div>
          <motion.div whileHover={{ scale: 1.05 }}><NavLink to="/analysis" className={navLinkClasses}> <FaChartBar className="mr-3" /> Analysis </NavLink></motion.div>
          <motion.div whileHover={{ scale: 1.05 }}><NavLink to="/ai-insights" className={navLinkClasses}> <FaRobot className="mr-3" /> AI Insights </NavLink></motion.div>
          <motion.div whileHover={{ scale: 1.05 }}><NavLink to="/history" className={navLinkClasses}> <FaHistory className="mr-3" /> History </NavLink></motion.div>
          {user && user.role === 'admin' && (
            <motion.div whileHover={{ scale: 1.05 }}><NavLink to="/admin" className={navLinkClasses}> <FaUserShield className="mr-3" /> Admin </NavLink></motion.div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;