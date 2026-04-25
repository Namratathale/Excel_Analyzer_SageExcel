import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { parseFile, clearFileData } from '../redux/fileSlice';
import { clearChartConfig } from '../redux/chartSlice';
import toast from 'react-hot-toast';
import { FaUpload } from 'react-icons/fa';
import { motion } from 'framer-motion';

const UploadPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { isParsing } = useSelector((state) => state.file);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(clearFileData());
      dispatch(clearChartConfig());
      dispatch(parseFile(file))
        .unwrap()
        .then((payload) => {
          toast.success(`"${payload.fileName}" parsed successfully!`);
          navigate('/analysis');
        })
        .catch((errorMessage) => {
          toast.error(errorMessage);
        });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex items-center justify-center p-10 text-center bg-white border rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <div>
        <FaUpload className="mx-auto mb-6 text-6xl text-indigo-500" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Upload Your Data File
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Select an Excel (.xlsx, .xls) or CSV file to begin.
        </p>
        <div className="mt-12">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".xlsx, .xls, .csv"
          />
          <motion.button
            onClick={handleUploadClick}
            disabled={isParsing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isParsing ? 'Parsing...' : 'Choose a File'}
          </motion.button>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Supported formats: .xlsx, .xls, .csv
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;