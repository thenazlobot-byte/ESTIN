import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { registerNewUser, setAuth, isLoading } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add to Admin's Master List
      registerNewUser({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone
      });

      // Auto-login the user
      setAuth({ 
        id: 'new-id-' + Date.now(), 
        email: formData.email,
        full_name: formData.full_name,
        phone: formData.phone,
        role: 'customer'
      }, 'token-' + Date.now());

      alert('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 gap-0 bg-[#343434]">
      {/* Left Panel - Features */}
      <div className="bg-[#739ee3] p-12 flex flex-col justify-center relative overflow-hidden hidden lg:flex">
        <div className="z-10">
          <p className="text-sm text-white font-semibold mb-4 tracking-widest uppercase">Premium Care</p>
          <h1 className="text-5xl font-bold text-white mb-6">
            Join the PetCare Community
          </h1>
          <p className="text-white text-lg mb-12 leading-relaxed max-w-md">
            The most advanced platform for pet health management and veterinary connections.
          </p>

          <div className="space-y-6">
            {[
              { icon: '🐾', title: 'Smart Booking', desc: 'Real-time scheduling with top vets' },
              { icon: '🦴', title: 'Full History', desc: 'Secure medical records for all your pets' },
              { icon: '🩺', title: 'Direct Access', desc: 'Connect with specialists instantly' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-white text-lg">{item.title}</h3>
                  <p className="text-blue-100 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#edc315] rounded-full opacity-20 blur-2xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#edc315] rounded-full opacity-10 blur-3xl" />
      </div>

      {/* Right Panel - Form */}
      <div className="p-8 lg:p-20 flex flex-col justify-center bg-[#343434]">
        <div className="bg-white p-10 rounded-2xl shadow-2xl relative">
          <Link to="/" className="absolute top-6 right-8 text-gray-400 hover:text-[#5380c1] transition-colors text-sm flex items-center gap-2">
            <i className="fa fa-home"></i> Home
          </Link>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-[#5380c1] mb-2">Create Account</h2>
              <p className="text-gray-500 text-sm">Join thousands of pet owners today</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#edc315] outline-none text-black transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#edc315] outline-none text-black transition-all"
                  placeholder="0550..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#edc315] outline-none text-black transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#edc315] outline-none text-black transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#5380c1] hover:bg-[#4269a1] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#5380c1] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
