import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../components/DashboardLayout';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, appointments } = useAuthStore();

  const userAppointments = appointments.filter(a => a.customer_name === user?.full_name);
  const upcomingCount = userAppointments.filter(a => a.status !== 'cancelled').length;

  return (
    <DashboardLayout activeSidebarItem="dashboard">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#343434] mb-2">
          Welcome back, {user?.full_name || 'Pet Owner'}! 👋
        </h1>
        <p className="text-gray-500">Here is what's happening with your pets today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[
          { label: 'My Pets', value: 'Live', icon: '🐾', color: 'text-[#5380c1]' },
          { label: 'My Visits', value: upcomingCount.toString(), icon: '📅', color: 'text-[#edc315]' },
          { label: 'Health Index', value: '94%', icon: '💚', color: 'text-green-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-50 flex flex-col items-center text-center group hover:-translate-y-2 transition-all">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{stat.icon}</div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</p>
            <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Appointments Section */}
      <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-gray-50 mb-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-[#343434]">My Appointments</h2>
            <p className="text-sm text-gray-400">Track your scheduled veterinary visits</p>
          </div>
          <button 
            onClick={() => navigate('/booking')} 
            className="bg-[#5380c1] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-[#4269a1] transition-all"
          >
            New Visit
          </button>
        </div>
        
        {userAppointments.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 italic">No upcoming appointments found.</p>
            <Link to="/booking" className="text-[#5380c1] font-bold hover:underline mt-4 inline-block">Book your first visit →</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userAppointments.map((appt) => (
              <div key={appt.id} className="flex flex-col md:flex-row md:items-center gap-6 p-6 border border-gray-50 rounded-3xl hover:bg-[#F8F9FA] transition-all group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                  {appt.pet_type?.toLowerCase().includes('dog') ? '🐕' : '🐈'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-[#343434]">{appt.pet_name}</h3>
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">• {appt.appointment_date}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-md mb-2">{appt.reason || 'Routine checkup'}</p>
                  {appt.health_booklet_url && (
                    <a 
                      href={appt.health_booklet_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-[#5380c1] hover:underline"
                    >
                      View Health Booklet 📄
                    </a>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                    appt.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700'
                      : appt.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-[#edc31520] text-[#edc315]'
                  }`}>
                    {appt.status}
                  </span>
                  <p className="text-sm font-bold text-[#343434]">{appt.appointment_time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button
          onClick={() => navigate('/booking')}
          className="bg-white rounded-[2rem] p-10 border border-gray-50 shadow-xl hover:shadow-2xl hover:border-[#5380c120] transition-all text-left group"
        >
          <div className="w-16 h-16 bg-[#5380c105] rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">📅</div>
          <h3 className="text-2xl font-bold text-[#343434] mb-2">Book a New Visit</h3>
          <p className="text-gray-500 leading-relaxed">Schedule a veterinarian visit for your beloved companion.</p>
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-xl hover:shadow-2xl hover:border-[#5380c120] transition-all text-left group"
        >
          <div className="w-16 h-16 bg-[#edc31505] rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">👤</div>
          <h3 className="text-2xl font-bold text-[#343434] mb-2">Account Settings</h3>
          <p className="text-gray-500 leading-relaxed">Update your profile, phone number, and pet information.</p>
        </button>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
