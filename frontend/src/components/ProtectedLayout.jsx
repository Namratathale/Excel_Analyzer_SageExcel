import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCharts } from '../redux/chartSlice';

import Sidebar from './Sidebar';
import Header from './Header';

const ProtectedLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      // When a user is detected, fetch their data.
      dispatch(getCharts())
        .unwrap()
        .finally(() => {
          // Once the data fetch is complete, mark it as loaded.
          setIsDataLoaded(true);
        });
    }
  }, [user, dispatch]);

  // If there is no user, redirect to the login page immediately.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If there IS a user, but their data hasn't finished loading yet,
  // show a full-screen loading indicator.
  if (!isDataLoaded) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl font-semibold text-gray-800 dark:text-white">Loading your workspace...</p>
      </div>
    );
  }

  // Once the user is verified AND their data is loaded, show the full layout.
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-grow p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* The Outlet renders the correct page (Dashboard, History, etc.) */}
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
