import React from 'react';
import useDarkMode from '../utils/useDarkMode';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const [theme, setTheme] = useDarkMode();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-xl text-gray-600 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"
        >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </motion.button>
    );
};

export default ThemeToggle; // <-- THIS IS THE FIX
