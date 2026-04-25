import React, { useState } from 'react';
import ChartView from './ChartView'; // 2D Chart
import Chart3DBuilder from './Chart3DBuilder'; // 3D Chart

const ChartConfigurator = () => {
  const [chartMode, setChartMode] = useState('2d'); // '2d' or '3d'

  return (
    <div className="p-6 mt-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Chart Builder</h3>
          <div>
              <label className="mr-4 text-sm font-medium text-gray-700 dark:text-gray-300">Chart Mode</label>
              <select
                value={chartMode}
                onChange={(e) => setChartMode(e.target.value)}
                className="p-2 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                  <option value="2d">2D</option>
                  <option value="3d">3D</option>
              </select>
          </div>
      </div>

      {/* Conditionally render the correct chart builder */}
      {chartMode === '2d' ? <ChartView /> : <Chart3DBuilder />}
    </div>
  );
};

export default ChartConfigurator;