import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateAiSummary, resetAiState } from '../redux/aiSlice';
import toast from 'react-hot-toast';
import { FaRobot, FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AiInsightsPage = () => {
    const dispatch = useDispatch();
    const { headers, rows } = useSelector((state) => state.file);
    const { summary, isLoading, isError, message } = useSelector((state) => state.ai);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        // Clean up AI state when the component unmounts
        return () => {
            dispatch(resetAiState());
        }
    }, [isError, message, dispatch]);

    const handleGenerateClick = () => {
        if (headers.length === 0) {
            toast.error('Please upload a file first!');
            return;
        }
        dispatch(generateAiSummary(headers));
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex items-center mb-6">
                <FaRobot className="mr-4 text-4xl text-indigo-500" />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">AI-Powered Insights</h1>
            </div>

            <p className="mb-6 text-gray-600 dark:text-gray-300">
                Let our AI analyze the structure of your data ({rows.length} rows) and provide a quick summary and chart recommendations.
            </p>

            <button
                onClick={handleGenerateClick}
                disabled={isLoading}
                className="flex items-center px-6 py-3 font-bold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-wait"
            >
                <FaLightbulb className="mr-2" />
                {isLoading ? 'Generating...' : 'Generate Insights'}
            </button>

            {summary && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 mt-8 whitespace-pre-wrap bg-gray-100 border-l-4 border-indigo-500 rounded-r-lg dark:bg-gray-700"
                >
                    <p className="text-gray-800 dark:text-gray-200">{summary}</p>
                </motion.div>
            )}
        </div>
    );
};

export default AiInsightsPage;