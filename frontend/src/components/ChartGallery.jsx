import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCharts } from '../redux/chartSlice'; // Make sure this path is correct
import { motion } from 'framer-motion';
import SavedChartCard from './SavedChartCard'; // Import the card component

const ChartGallery = () => {
  const dispatch = useDispatch();
  const { charts, isLoading, isError, message } = useSelector((state) => state.chart);

  useEffect(() => {
    // Fetch charts when the component mounts
    dispatch(getCharts());
  }, [dispatch]);

  if (isLoading) {
    return <div className="text-center p-10 dark:text-white">Loading charts...</div>;
  }

  if (isError) {
    return <div className="text-center p-10 text-red-500">Error: {message}</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-4 md:p-6"
    >
      <h2 className="text-2xl font-bold mb-6 dark:text-white">My Saved Charts</h2>
      {charts && charts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charts.map((chart) => (
            <SavedChartCard key={chart._id} chart={chart} />
          ))}
        </div>
      ) : (
        <div className="text-center p-10 border-2 border-dashed rounded-lg dark:border-gray-600">
          <p className="dark:text-gray-400">You haven't saved any charts yet.</p>
          <p className="dark:text-gray-500 text-sm">Create a chart and save it to see it here.</p>
        </div>
      )}
    </motion.div>
  );
};

export default ChartGallery;
