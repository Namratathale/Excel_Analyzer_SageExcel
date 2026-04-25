import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/authSlice';
import { FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-end p-4 bg-white shadow-md dark:bg-gray-800">
      <nav>
        <ul className="flex items-center space-x-6">
          {user && (
            <li className="font-semibold text-gray-700 dark:text-gray-200">
              Hello, {user.name}
            </li>
          )}
          <li>
            <ThemeToggle />
          </li>
          {user && (
            <li>
              <motion.button
                onClick={onLogout}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </motion.button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;