// FILE: src/components/SavedChartCard.jsx
// This component renders a SINGLE saved chart.

import React from 'react';
import Plot from 'react-plotly.js';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper for random colors for the Pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const SavedChartCard = ({ chart }) => {
  // Ensure we have data to render
  if (!chart || !chart.rows || !chart.headers) {
    return (
      <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
        <h3 className="font-bold text-lg mb-2 dark:text-white">Invalid Chart Data</h3>
      </div>
    );
  }

  const { chartType, xKey, yKey, zKey, rows } = chart;
  const is3D = chartType === 'scatter3d';
  const chartData = rows.map(row => ({ ...row, [yKey]: parseFloat(row[yKey]) || 0 }));

  const renderChart = () => {
    if (is3D) {
      const plotData = [{
        x: rows.map(r => r[xKey]),
        y: rows.map(r => r[yKey]),
        z: rows.map(r => r[zKey]),
        mode: 'markers',
        type: 'scatter3d',
        marker: { size: 5, color: rows.map(r => r[zKey]).map(Number), colorscale: 'Viridis' },
      }];
      return (
        <Plot
          data={plotData}
          layout={{ 
            title: { text: '', font: { size: 12 } },
            margin: { l: 0, r: 0, b: 0, t: 0 } 
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
        />
      );
    }

    switch (chartType) {
      case 'line':
        return <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey={xKey} tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey={yKey} stroke="#8884d8" /></LineChart>;
      case 'pie':
        return <PieChart><Tooltip /><Pie data={chartData} dataKey={yKey} nameKey={xKey} cx="50%" cy="50%" innerRadius={40} outerRadius={80} fill="#8884d8">{chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie></PieChart>;
      case 'bar':
      default:
        return <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey={xKey} tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Legend /><Bar dataKey={yKey} fill="#82ca9d" /></BarChart>;
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 flex flex-col h-full">
      <h3 className="font-bold text-lg mb-2 truncate dark:text-white" title={chart.title}>{chart.title}</h3>
      <div className="flex-grow w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SavedChartCard;


// ==================================================================

