import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#739ee3]">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#5380c1] flex-col justify-between p-12 relative overflow-hidden">
        <div className="text-white text-3xl font-bold z-10">PetCare</div>
        
        {/* Decorative Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#edc315] rounded-full -mr-32 -mt-32 opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#edc315] rounded-full -ml-48 -mb-48 opacity-10" />

        <div className="text-center z-10">
          <div className="text-8xl mb-8 drop-shadow-lg">🐾</div>
          <h2 className="text-4xl font-bold text-white mb-4">Welcome Back</h2>
          <p className="text-blue-100 text-lg tracking-wider">Premium veterinary care for your beloved pets</p>
        </div>
        <p className="text-blue-200 text-sm z-10">&copy; 2026 PetCare Pet Care</p>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#343434]">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl relative">
          <Link to="/" className="absolute top-6 right-8 text-gray-400 hover:text-[#5380c1] transition-colors text-sm flex items-center gap-2">
            <i className="fa fa-home"></i> Home
          </Link>
          <h1 className="text-3xl font-bold mb-2 text-[#5380c1]">Sign In</h1>
          <p className="text-gray-500 mb-8">Access your pet care portal</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#edc315] focus:border-transparent outline-none transition-all text-black"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#edc315] focus:border-transparent outline-none transition-all text-black"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#edc315] hover:bg-[#d4ae12] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#5380c1] font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] text-gray-400 font-bold mb-4 uppercase tracking-[2px] text-center">Demo Access</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setEmail('admin@petcare.com'); setPassword('admin123'); }}
                className="py-3 px-4 bg-[#5380c1] text-white rounded-xl text-xs font-bold hover:bg-[#4269a1] transition-all transform hover:scale-105"
              >
                Admin
              </button>
              <button 
                onClick={() => { setEmail('customer@petcare.com'); setPassword('customer123'); }}
                className="py-3 px-4 bg-[#edc315] text-white rounded-xl text-xs font-bold hover:bg-[#d4ae12] transition-all transform hover:scale-105"
              >
                Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
