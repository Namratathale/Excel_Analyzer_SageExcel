import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DataTable from '../components/DataTable';
import UnifiedChartBuilder from '../components/UnifiedChartBuilder';

const AnalysisPage = () => {
    const fileState = useSelector((state) => state.file);
    const rows = fileState ? fileState.rows : [];

    if (!rows || rows.length === 0) {
        return (
            <div className="p-10 text-center bg-white border rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">No Data Loaded</h1>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                    Please upload a file to begin your analysis.
                </p>
                <div className="mt-8">
                    <Link to="/upload" className="px-6 py-3 font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700">
                        Upload a File
                    </Link>
                </div>
            </div>
        );
    }

    // New Layout: Chart Builder is now on top, Data Table is below.
    return (
        <div className="space-y-8">
            <UnifiedChartBuilder />
            <DataTable />
        </div>
    );
};

export default AnalysisPage;
