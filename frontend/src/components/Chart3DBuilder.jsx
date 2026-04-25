import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Plot from 'react-plotly.js';
import { motion } from 'framer-motion';
import { saveChart, resetSaveState } from '../redux/chartSlice';
import toast from 'react-hot-toast';

const Chart3DBuilder = () => {
    const dispatch = useDispatch();
    const { headers, rows, fileName } = useSelector((state) => state.file);
    const { isSaving, isSaveSuccess, isSaveError, saveMessage } = useSelector((state) => state.chart);

    const [chartType, setChartType] = useState('scatter3d');
    const [xKey, setXKey] = useState('');
    const [yKey, setYKey] = useState('');
    const [zKey, setZKey] = useState('');

    useEffect(() => {
        if (headers.length >= 3) {
            setXKey(headers[0]);
            setYKey(headers[1]);
            setZKey(headers[2]);
        }
    }, [headers]);
    
    useEffect(() => {
        if (isSaveSuccess) {
            toast.success(saveMessage);
            dispatch(resetSaveState());
        }
        if (isSaveError) {
            toast.error(saveMessage);
            dispatch(resetSaveState());
        }
    }, [isSaveSuccess, isSaveError, saveMessage, dispatch]);

    const getAxisData = (key) => rows.map(row => row[key]);

    const getChartData = () => {
        const xData = getAxisData(xKey);
        const yData = getAxisData(yKey);
        const zData = getAxisData(zKey).map(Number); // Ensure Z data is numeric

        switch (chartType) {
            case 'surface':
                return [{ z: [zData], type: 'surface' }];
            case 'mesh3d':
                return [{ x: xData, y: yData, z: zData, type: 'mesh3d', opacity: 0.7 }];
            case 'scatter3d':
            default:
                return [{
                    x: xData, y: yData, z: zData,
                    mode: 'markers', type: 'scatter3d',
                    marker: { size: 5, color: zData, colorscale: 'Viridis' },
                }];
        }
    };
    
    const handleSaveChart = () => {
        const chartDataToSave = {
            originalFileName: fileName,
            title: `${fileName} - ${chartType}`,
            chartType: chartType,
            xKey,
            yKey,
            zKey
        };
        dispatch(saveChart(chartDataToSave));
    };

    const chartOptions = [
        { value: 'scatter3d', label: 'Scatter 3D' },
        { value: 'surface', label: 'Surface 3D' },
        { value: 'mesh3d', label: 'Mesh 3D (Bar)' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-4">
            {/* Axis Selectors */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {['xKey', 'yKey', 'zKey'].map(axis => (
                    <div key={axis}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {axis.replace('Key', '').toUpperCase()}-Axis
                        </label>
                        <select
                            value={{xKey, yKey, zKey}[axis]}
                            onChange={(e) => ({'xKey': setXKey, 'yKey': setYKey, 'zKey': setZKey}[axis])(e.target.value)}
                            className="w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            {headers.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                    </div>
                ))}
            </div>
            
            {/* Chart Type and Save Button */}
            <div className="flex items-end justify-between">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chart Type</label>
                    <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {chartOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                <button onClick={handleSaveChart} disabled={isSaving} className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Chart'}
                </button>
            </div>

            {/* Plotly Chart */}
            <div className="p-2 bg-gray-200 rounded-lg dark:bg-gray-700">
                <Plot
                    data={getChartData()}
                    layout={{
                        title: `3D Chart: ${fileName}`,
                        autosize: true,
                        scene: {
                            xaxis: { title: xKey },
                            yaxis: { title: yKey },
                            zaxis: { title: zKey },
                        }
                    }}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '500px' }}
                />
            </div>
        </motion.div>
    );
};

export default Chart3DBuilder;
