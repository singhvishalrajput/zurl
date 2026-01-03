import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/authContext';
import { checkUsernameAvailability, checkEmailAvailability } from '../api/auth.api';
import { useDebounce } from '../hooks/useDebounce';
import { Check, X, Loader2, UserPlus, User, Mail, Lock as LockIcon } from 'lucide-react';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Username availability
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const debouncedUsername = useDebounce(formData.username, 500);
  
  // Email availability
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const debouncedEmail = useDebounce(formData.email, 500);

  useEffect(() => {
    if (debouncedUsername && debouncedUsername.length >= 3) {
      checkUsername(debouncedUsername);
    } else {
      setUsernameAvailable(null);
    }
  }, [debouncedUsername]);

  useEffect(() => {
    if (debouncedEmail && debouncedEmail.includes('@')) {
      checkEmail(debouncedEmail);
    } else {
      setEmailAvailable(null);
    }
  }, [debouncedEmail]);

  const checkUsername = async (username) => {
    setCheckingUsername(true);
    try {
      const result = await checkUsernameAvailability(username);
      setUsernameAvailable(result.available);
    } catch (error) {
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const checkEmail = async (email) => {
    setCheckingEmail(true);
    try {
      const result = await checkEmailAvailability(email);
      setEmailAvailable(result.available);
    } catch (error) {
      setEmailAvailable(null);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!usernameAvailable) {
      newErrors.username = 'Username is not available';
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    } else if (!emailAvailable) {
      newErrors.email = 'Email is already registered';
    }
    
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Signup failed' });
    } finally {
      setLoading(false);
    }
  };

  const getIndicator = (checking, available) => {
    if (checking) return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
    if (available === true) return <Check className="w-4 h-4 text-green-600" />;
    if (available === false) return <X className="w-4 h-4 text-red-600" />;
    return null;
  };

  const getStatusBadge = (checking, available, field) => {
    if (checking) return null;
    if (available === true) return <span className="text-xs px-2 py-1 bg-green-50 text-green-600 border border-green-200">Available</span>;
    if (available === false) return <span className="text-xs px-2 py-1 bg-red-50 text-red-600 border border-red-200">Already {field === 'username' ? 'taken' : 'registered'}</span>;
    return null;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Sign up to manage your short URLs</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 pr-10"
                required
                minLength={3}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getIndicator(checkingUsername, usernameAvailable)}
              </div>
            </div>
            {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
            {getStatusBadge(checkingUsername, usernameAvailable, 'username')}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900 pr-10"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {getIndicator(checkingEmail, emailAvailable)}
              </div>
            </div>
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            {getStatusBadge(checkingEmail, emailAvailable, 'email')}
          </div>

              {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900"
              required
              minLength={6}
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-gray-900"
              required
            />
            {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !usernameAvailable || !emailAvailable}
            className="w-full px-8 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-900 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
