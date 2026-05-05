import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import DashboardLayout from '../components/DashboardLayout';

const AdminDashboard = () => {
  const { appointments, updateAppointmentStatus } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'appointments' | 'orders' | 'users'>('appointments');

  const stats = [
    { label: 'Pending Requests', value: appointments.filter(a => a.status === 'pending').length.toString(), icon: '⏳', color: 'text-yellow-500' },
    { label: 'Confirmed Today', value: appointments.filter(a => a.status === 'confirmed').length.toString(), icon: '✅', color: 'text-green-500' },
    { label: 'Total Revenue', value: '$12,450', icon: '💰', color: 'text-[#5380c1]' },
    { label: 'Active Users', value: '156', icon: '👥', color: 'text-[#edc315]' },
  ];

  return (
    <DashboardLayout activeSidebarItem="dashboard">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#343434] mb-2">Clinic Command Center</h1>
        <p className="text-gray-500">Overview of all pet care requests and clinic operations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-50 flex flex-col items-center text-center group hover:-translate-y-1 transition-all">
            <div className="text-4xl mb-4">{stat.icon}</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-50 overflow-hidden">
        <div className="flex border-b border-gray-50">
          {['appointments', 'orders', 'users'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-6 font-bold text-sm uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-[#5380c105] text-[#5380c1] border-b-4 border-[#5380c1]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-10">
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              {appointments.length === 0 ? (
                <div className="text-center py-20 text-gray-400 italic">No appointment requests yet.</div>
              ) : (
                appointments.map((appt) => (
                  <div key={appt.id} className="flex flex-col lg:flex-row lg:items-center gap-8 p-8 border border-gray-50 rounded-[2rem] hover:bg-[#F8F9FA] transition-all">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-sm border border-gray-100">
                        {appt.pet_type.includes('Dog') ? '🐕' : '🐈'}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-2xl font-bold text-[#343434]">{appt.pet_name}</h3>
                          <span className="text-xs bg-[#5380c115] text-[#5380c1] px-3 py-1 rounded-full font-bold">
                            {appt.pet_type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 font-bold mb-3">Owner: <span className="text-[#343434]">{appt.customer_name}</span></p>
                        <div className="flex gap-4 mb-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#5380c1]">
                            <i className="fa fa-phone bg-[#5380c110] p-2 rounded-lg"></i> {appt.customer_phone}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-[#5380c1]">
                            <i className="fa fa-envelope bg-[#5380c110] p-2 rounded-lg"></i> {appt.customer_email}
                          </div>
                        </div>
                        <div className="p-4 bg-white rounded-2xl text-sm text-gray-500 border border-gray-100">
                          <strong className="text-[#5380c1]">Patient State:</strong> {appt.reason}
                          {appt.health_booklet_url && (
                            <div className="mt-3 pt-3 border-t border-gray-50">
                              <a 
                                href={appt.health_booklet_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs font-bold text-[#edc315] hover:underline"
                              >
                                View Health Booklet 📄
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:items-end gap-6 min-w-[200px]">
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#343434]">{appt.appointment_time}</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{appt.appointment_date}</p>
                      </div>
                      
                      <div className="flex gap-3 w-full lg:w-auto">
                        {appt.status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => updateAppointmentStatus(appt.id, 'confirmed')}
                              className="flex-1 lg:px-6 py-3 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all shadow-lg"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                              className="flex-1 lg:px-6 py-3 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all shadow-lg"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <span className={`w-full text-center px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest ${
                            appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {appt.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="text-center py-20 text-gray-400 italic">No store orders to display.</div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {useAuthStore.getState().registeredUsers.map((client) => (
                  <div key={client.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-[#5380c105] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">👤</div>
                    <h3 className="text-xl font-bold text-[#343434] mb-2">{client.full_name}</h3>
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <i className="fa fa-envelope text-[#5380c1]"></i> {client.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <i className="fa fa-phone text-[#5380c1]"></i> {client.phone}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a href={`tel:${client.phone}`} className="flex-1 py-3 bg-[#5380c1] text-white rounded-xl text-center text-xs font-bold hover:bg-[#4269a1] transition-all">
                        Call
                      </a>
                      <a href={`mailto:${client.email}`} className="flex-1 py-3 bg-white border border-gray-100 text-[#343434] rounded-xl text-center text-xs font-bold hover:bg-gray-50 transition-all">
                        Email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
