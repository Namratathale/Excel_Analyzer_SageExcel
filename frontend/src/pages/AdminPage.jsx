import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, getStats } from '../redux/adminSlice';
import { FaUserShield, FaUsers, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StatCard = ({ icon, title, value, color }) => (
    <motion.div 
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
        }}
        className="flex items-center p-4 bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
        <div className={`p-3 mr-4 text-white rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
    </motion.div>
);

const AdminPage = () => {
    const dispatch = useDispatch();
    const { users, stats, isLoading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(getUsers());
        dispatch(getStats());
    }, [dispatch]);

    const containerVariants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center">
                <FaUserShield className="mr-4 text-4xl text-indigo-500" />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Admin Dashboard
                </h1>
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                <StatCard icon={<FaUsers size={24} />} title="Total Users" value={stats.users ?? '...'} color="bg-blue-500" />
                <StatCard icon={<FaChartLine size={24} />} title="Analyses Performed" value={stats.analyses ?? '...'} color="bg-green-500" />
            </motion.div>

            <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                 <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Registered Users</h2>
                 <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Joined On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && users.length === 0 ? (
                                <tr><td colSpan="4" className="p-4 text-center">Loading users...</td></tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        {/* --- THIS IS THE FIX --- */}
                                        <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;