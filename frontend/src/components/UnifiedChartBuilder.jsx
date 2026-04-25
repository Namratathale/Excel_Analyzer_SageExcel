import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Plot from 'react-plotly.js';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { saveChart, resetSaveState } from '../redux/chartSlice';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaDownload } from 'react-icons/fa';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const chartOptions = {
    '2d': [
        { value: 'bar', label: 'Bar Chart' },
        { value: 'line', label: 'Line Chart' },
        { value: 'pie', label: 'Pie Chart' },
    ],
    '3d': [
        { value: 'scatter3d', label: 'Scatter 3D' },
        { value: 'surface', label: 'Surface 3D' },
    ]
};

const UnifiedChartBuilder = () => {
    const dispatch = useDispatch();
    const { headers, rows, fileName } = useSelector((state) => state.file);
    const { isSaving, isSaveSuccess, isSaveError, saveMessage } = useSelector((state) => state.chart);
    
    // Create a ref to target the chart container for the screenshot
    const chartContainerRef = useRef(null);

    const [dimension, setDimension] = useState('2d');
    const [chartType, setChartType] = useState('bar');
    const [xKey, setXKey] = useState('');
    const [yKey, setYKey] = useState('');
    const [zKey, setZKey] = useState('');

    useEffect(() => {
        if (headers.length > 0) setXKey(headers[0]);
        if (headers.length > 1) setYKey(headers[1]);
        if (headers.length > 2) setZKey(headers[2]);
    }, [headers]);

    useEffect(() => {
        if (isSaveSuccess) toast.success(saveMessage);
        if (isSaveError) toast.error(saveMessage);
        if (isSaveSuccess || isSaveError) dispatch(resetSaveState());
    }, [isSaveSuccess, isSaveError, saveMessage, dispatch]);

    const handleDimensionChange = (e) => {
        const newDimension = e.target.value;
        setDimension(newDimension);
        setChartType(chartOptions[newDimension][0].value);
    };
    
    const handleSaveChart = () => {
        dispatch(saveChart({ originalFileName: fileName, title: `${fileName} - ${chartType}`, chartType, xKey, yKey, zKey, headers, rows }));
    };

    const handleDownloadPdf = () => {
        const input = chartContainerRef.current;
        if (!input) {
            toast.error("Chart container not found!");
            return;
        }

        toast.loading('Generating PDF...');

        html2canvas(input, { 
            useCORS: true, 
            scale: 2, // Increase scale for better quality
            backgroundColor: '#ffffff' // Set a white background for consistency
        })
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape', 'px', 'a4'); // a4 size in pixels, landscape
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            let width = pdfWidth - 20; // Add some margin
            let height = width / ratio;

            // If the calculated height is too big, resize based on height instead
            if (height > pdfHeight - 20) {
                height = pdfHeight - 20;
                width = height * ratio;
            }

            // Center the image
            const x = (pdfWidth - width) / 2;
            const y = (pdfHeight - height) / 2;

            pdf.addImage(imgData, 'PNG', x, y, width, height);
            pdf.save(`${fileName}_chart.pdf`);
            toast.dismiss();
            toast.success("PDF downloaded successfully!");
        })
        .catch(err => {
            toast.dismiss();
            toast.error("Failed to generate PDF.");
            console.error(err);
        });
    };

    const chartData = rows.map(row => ({ ...row, [yKey]: parseFloat(row[yKey]) || 0 }));

    const renderChart = () => {
        if (!xKey || !yKey || (dimension === '3d' && !zKey)) {
            return <div className="flex items-center justify-center h-full text-gray-500">Please select valid axes for your chart.</div>;
        }

        if (dimension === '3d') {
            const plotData = [{
                x: rows.map(r => r[xKey]),
                y: rows.map(r => r[yKey]),
                z: rows.map(r => r[zKey]),
                type: chartType,
                mode: chartType === 'scatter3d' ? 'markers' : undefined,
                marker: chartType === 'scatter3d' ? { size: 5, color: rows.map(r => r[zKey]).map(Number), colorscale: 'Viridis' } : undefined,
            }];
            return <Plot data={plotData} layout={{ title: `3D Chart`, scene: { xaxis: { title: xKey }, yaxis: { title: yKey }, zaxis: { title: zKey } } }} useResizeHandler={true} style={{ width: '100%', height: '100%' }} />;
        }

        switch (chartType) {
            case 'line': return <LineChart data={chartData}><CartesianGrid /><XAxis dataKey={xKey} /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey={yKey} stroke="#8884d8" /></LineChart>;
            case 'pie': return <PieChart><Tooltip /><Pie data={chartData} dataKey={yKey} nameKey={xKey} cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>{chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart>;
            case 'bar': default: return <BarChart data={chartData}><CartesianGrid /><XAxis dataKey={xKey} /><YAxis /><Tooltip /><Legend /><Bar dataKey={yKey} fill="#82ca9d" /></BarChart>;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <h3 className="w-full text-xl font-bold text-gray-800 dark:text-white md:w-auto">Chart Builder</h3>
                {/* Dimension and Chart Type selectors */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dimension</label>
                    <select value={dimension} onChange={handleDimensionChange} className="w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <option value="2d">2D</option>
                        <option value="3d">3D</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chart Type</label>
                    <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {chartOptions[dimension].map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleSaveChart} disabled={isSaving} className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {isSaving ? 'Saving...' : 'Save Analysis'}
                    </button>
                    {/* --- NEW DOWNLOAD BUTTON --- */}
                    <button onClick={handleDownloadPdf} className="flex items-center px-6 py-2 font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-700">
                        <FaDownload className="mr-2" />
                        PDF
                    </button>
                </div>
            </div>

            {/* Axis selectors */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{dimension === '3d' ? 'X-Axis' : 'Category (X-Axis)'}</label><select value={xKey} onChange={(e) => setXKey(e.target.value)} className="w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">{headers.map(h => <option key={h} value={h}>{h}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{dimension === '3d' ? 'Y-Axis' : 'Value (Y-Axis)'}</label><select value={yKey} onChange={(e) => setYKey(e.target.value)} className="w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">{headers.map(h => <option key={h} value={h}>{h}</option>)}</select></div>
                {dimension === '3d' && <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Z-Axis</label><select value={zKey} onChange={(e) => setZKey(e.target.value)} className="w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">{headers.map(h => <option key={h} value={h}>{h}</option>)}</select></div>}
            </div>

            {/* --- ADD REF TO THIS CONTAINER --- */}
            <div ref={chartContainerRef} className="w-full h-[500px] p-4 bg-white rounded-lg flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default UnifiedChartBuilder;