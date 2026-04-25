import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCharts, loadHistoricalChart, deleteChart } from '../redux/chartSlice'; // Import deleteChart
import { loadHistoricalFile } from '../redux/fileSlice';
import AnalysisCard from '../components/AnalysisCard';
import toast from 'react-hot-toast';

const HistoryPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { history, isHistoryLoading } = useSelector((state) => state.chart);

    useEffect(() => {
        // This fetch is now handled by ProtectedLayout, but we can keep it as a fallback.
        if (history.length === 0) {
            dispatch(getCharts());
        }
    }, [dispatch, history.length]);

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
              .then(() => {
                  toast.success('Analysis deleted successfully!');
              })
              .catch((err) => {
                  toast.error(`Failed to delete: ${err}`);
              });
        }
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Full Analysis History</h1>
            {isHistoryLoading && history.length === 0 ? (
                <p className="dark:text-white">Loading history...</p>
            ) : history.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">You have no saved analyses.</p>
            ) : (
                // --- FIX: Removed the duplicate mapping. This is the single source of truth. ---
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {history.map((chart) => (
                        <AnalysisCard
                            key={chart._id}
                            chart={chart}
                            onLoad={handleLoadAnalysis}
                            onDelete={handleDeleteAnalysis} // Pass the handler
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;