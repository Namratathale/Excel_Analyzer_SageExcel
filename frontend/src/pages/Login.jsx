import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../redux/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    // On successful login, just navigate. The ProtectedLayout will handle data loading.
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Sign In to SageExcel</h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <div><label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label><input type="email" name="email" id="email" value={email} onChange={onChange} required className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"/></div>
          <div><label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label><input type="password" name="password" id="password" value={password} onChange={onChange} required className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"/></div>
          <button type="submit" className="w-full py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign In</button>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">Don't have an account?{' '}<Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;
