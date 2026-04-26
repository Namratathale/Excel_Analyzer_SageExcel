import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loadHistoricalChart, deleteChart } from '../redux/chartSlice'; // Import deleteChart
import { loadHistoricalFile } from '../redux/fileSlice';
import AnalysisCard from '../components/AnalysisCard';
import { FaPlusCircle, FaHistory } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { history, isHistoryLoading } = useSelector((state) => state.chart);

    const handleLoadAnalysis = (chart) => {
        dispatch(loadHistoricalFile(chart));
        dispatch(loadHistoricalChart(chart));
        navigate('/analysis');
    };

    // --- FIX: Add the delete handler ---
    const handleDeleteAnalysis = (chartId) => {
        if (window.confirm('Are you sure you want to delete this analysis?')) {
            dispatch(deleteChart(chartId))
              .unwrap()
              .then(() => toast.success('Analysis deleted!'))
              .catch((err) => toast.error(`Failed to delete: ${err}`));
        }
    };

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome back, {user?.name}!</h1>
                <Link to="/upload" className="flex items-center px-4 py-2 font-bold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700">
                    <FaPlusCircle className="mr-2" />New Upload
                </Link>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Recent Analyses</h2>
                    <Link to="/history" className="flex items-center text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                        View Full History <FaHistory className="ml-2" />
                    </Link>
                </div>
                {isHistoryLoading ? (
                    <p className="mt-4 dark:text-gray-400">Loading your history...</p>
                ) : !history || !Array.isArray(history) || history.length === 0 ? (
                    <p className="mt-4 text-gray-500 dark:text-gray-400">You have no saved analyses. Start by uploading a new file!</p>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
                        {history.slice(0, 3).map((chart) => (
                           <AnalysisCard
                                key={chart._id}
                                chart={chart}
                                onLoad={handleLoadAnalysis}
                                onDelete={handleDeleteAnalysis} // Pass the handler
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;