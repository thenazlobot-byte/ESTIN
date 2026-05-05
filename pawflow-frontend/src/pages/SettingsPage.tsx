import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await apiService.updateProfile(formData);
      setUser({ ...user!, ...formData });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout activeSidebarItem="settings">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard" className="text-gray-400 hover:text-[#5380c1] text-xs font-bold uppercase tracking-widest mb-6 inline-flex items-center gap-2 group transition-colors">
          <i className="fa fa-arrow-left transition-transform group-hover:-translate-x-1"></i> Back to Dashboard
        </Link>
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold text-[#343434] mb-2">Account Settings</h1>
            <p className="text-gray-500">Update your personal information and security preferences.</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all flex items-center gap-2"
          >
            <i className="fa fa-sign-out"></i> Sign Out
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
              <h2 className="text-xl font-bold text-[#5380c1] mb-8">Personal Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {message.text && (
                  <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-5 py-4 bg-[#F8F9FA] border-none rounded-2xl focus:ring-2 focus:ring-[#edc315] outline-none transition-all text-[#343434] font-bold"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Email Address (Locked)</label>
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    disabled
                    className="w-full px-5 py-4 bg-gray-100 border-none rounded-2xl cursor-not-allowed text-gray-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-5 py-4 bg-[#F8F9FA] border-none rounded-2xl focus:ring-2 focus:ring-[#edc315] outline-none transition-all text-[#343434] font-bold"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-[#5380c1] text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#4269a1] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
                  >
                    {isLoading ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="font-bold text-[#343434] mb-4">Security</h3>
              <p className="text-sm text-gray-500 mb-6">Manage your password and two-factor authentication.</p>
              <button className="w-full py-3 bg-[#F8F9FA] text-[#5380c1] rounded-xl font-bold hover:bg-[#edc31520] transition-colors text-sm">
                Change Password
              </button>
            </div>
            
            <div className="bg-[#edc31510] rounded-3xl p-8 border border-[#edc31530]">
              <h3 className="font-bold text-[#edc315] mb-4">Pro Member</h3>
              <p className="text-sm text-[#edc315] opacity-80 mb-6">You are currently on the Premium Plan. Enjoy your priority support!</p>
              <Link to="/pet-care" className="text-xs font-bold uppercase tracking-widest text-[#edc315] hover:underline">
                View Plan Benefits
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
