import React from 'react';
import { motion } from 'framer-motion';
import { FaFileExcel, FaArrowRight, FaTrash } from 'react-icons/fa';

const AnalysisCard = ({ chart, onLoad, onDelete }) => { // Added onDelete to props destructuring
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(chart._id);
  };

  return (
    <motion.div
      variants={cardVariants}
      className="flex flex-col justify-between p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800"
    >
      <div>
        <div className="flex items-center mb-4">
          <FaFileExcel className="mr-3 text-3xl text-green-500" />
          <h3 className="text-lg font-bold text-gray-800 truncate dark:text-white" title={chart.originalFileName}>
            {chart.originalFileName}
          </h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date(chart.updatedAt).toLocaleString()}
        </p>
      </div>
      {/* --- FIX: Wrapped buttons in a flex container for better layout --- */}
      <div className="flex items-center gap-2 mt-6">
        <motion.button
          onClick={() => onLoad(chart)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center flex-grow px-4 py-2 font-semibold text-white transition-colors duration-200 bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Continue <FaArrowRight className="ml-2" />
        </motion.button>
        <motion.button
          onClick={handleDelete}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          title="Delete Analysis"
        >
          <FaTrash />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AnalysisCard;