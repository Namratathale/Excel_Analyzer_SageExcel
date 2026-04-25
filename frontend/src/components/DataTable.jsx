import React from 'react';
import { useSelector } from 'react-redux';

const DataTable = () => {
  const { headers, rows, fileName } = useSelector((state) => state.file);

  if (rows.length === 0) {
    return null; // Don't render anything if there's no data
  }

  return (
    <div className="p-8 mx-auto max-w-7xl">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Preview: <span className="font-normal">{fileName}</span>
      </h2>
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {headers.map((header, index) => (
                <th key={index} scope="col" className="px-6 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;