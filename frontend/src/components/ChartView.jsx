import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { setChartConfig } from '../redux/chartSlice';

const ChartView = () => {
    const dispatch = useDispatch();
    const { headers, rows } = useSelector((state) => state.file);
    const { xAxisKey, yAxisKey } = useSelector((state) => state.chart);

    // Local state for dropdowns
    const [xKey, setXKey] = useState(xAxisKey || '');
    const [yKey, setYKey] = useState(yAxisKey || '');

    useEffect(() => {
        if (headers.length > 1 && !xAxisKey) {
            setXKey(headers[0]);
            setYKey(headers[1]);
            dispatch(setChartConfig({ xAxisKey: headers[0], yAxisKey: headers[1] }));
        }
    }, [headers, xAxisKey, dispatch]);

    const handleGenerate = () => {
        dispatch(setChartConfig({ xAxisKey: xKey, yAxisKey: yKey }));
    };

    const chartData = rows.map(row => ({
        ...row,
        [yKey]: parseFloat(row[yKey]) || 0
    }));

    return (
        <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">X-Axis</label>
                    <select value={xKey} onChange={(e) => setXKey(e.target.value)} className="w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Y-Axis</label>
                    <select value={yKey} onChange={(e) => setYKey(e.target.value)} className="w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
                <div className="self-end">
                    <button onClick={handleGenerate} className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Generate 2D Chart</button>
                </div>
            </div>
            <div className="p-2 bg-gray-200 rounded-lg dark:bg-gray-700" style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xKey} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={yKey} fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartView;