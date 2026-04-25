import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../redux/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  // State to hold our specific password error message
  const [passwordError, setPasswordError] = useState('');

  const { name, email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    // --- REAL-TIME VALIDATION LOGIC ---
    if (e.target.name === 'password') {
      if (e.target.value.length > 0 && e.target.value.length < 6) {
        setPasswordError('Password must be at least 6 characters');
      } else {
        setPasswordError(''); // Clear the error if the password is valid
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Extra check to prevent submission if the form is somehow submitted with an error
    if (passwordError) {
        toast.error('Please fix the errors before submitting.');
        return;
    }
    const userData = { name, email, password };
    dispatch(register(userData));
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Create an Account
        </h1>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Name and Email fields are unchanged */}
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input type="text" name="name" id="name" value={name} onChange={onChange} required className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"/>
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
            <input type="email" name="email" id="email" value={email} onChange={onChange} required className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"/>
          </div>

          {/* --- UPDATED PASSWORD FIELD --- */}
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={onChange}
              required
              className={`w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
            />
            {/* Conditionally render the error message */}
            {passwordError && (
              <p className="mt-2 text-xs text-red-500">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            // Disable the button if there's an error or if the form is loading
            disabled={!!passwordError || isLoading}
            className="w-full py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
