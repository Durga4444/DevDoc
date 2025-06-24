import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginRegister = () => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const success = mode === 'login'
      ? await login(email, password)
      : await register(email, password);
    setLoading(false);
    if (success) navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
        <div className="mt-6 text-center">
          {mode === 'login' ? (
            <>
              <span className="text-gray-600 dark:text-gray-400">Don&apos;t have an account?</span>
              <button
                className="ml-2 text-primary-600 dark:text-primary-400 font-medium hover:underline"
                onClick={() => { setMode('register'); setError(null); }}
              >
                Create one
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-600 dark:text-gray-400">Already have an account?</span>
              <button
                className="ml-2 text-primary-600 dark:text-primary-400 font-medium hover:underline"
                onClick={() => { setMode('login'); setError(null); }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginRegister; 