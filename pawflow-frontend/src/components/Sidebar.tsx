import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface SidebarProps {
  activeItem?: string;
}

export const Sidebar = ({ activeItem = 'dashboard' }: SidebarProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: user?.role === 'admin' ? '/admin' : '/dashboard' },
    ...(user?.role === 'admin' 
      ? [{ id: 'admin', label: 'Admin Panel', icon: '🛡️', path: '/admin' }]
      : [{ id: 'booking', label: 'Book Visit', icon: '➕', path: '/booking' }]
    ),
    { id: 'appointments', label: 'Appointments', icon: '📅', path: '/appointments' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  return (
    <aside className="w-72 bg-[#343434] border-r border-gray-800 p-6 flex flex-col min-h-screen shadow-2xl">
      <Link to="/" className="text-gray-500 hover:text-[#edc315] text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 group transition-colors">
        <i className="fa fa-arrow-left transition-transform group-hover:-translate-x-1"></i> Back to Website
      </Link>
      <div className="flex items-center gap-3 mb-12 group cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-16 h-16 flex items-center justify-center transition-transform group-hover:scale-110">
          <img src="/logo.png" alt="PetCare Logo" className="brightness-0 invert" />
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all ${
              activeItem === item.id
                ? 'bg-[#edc315] text-white font-bold shadow-lg transform -translate-y-1'
                : 'text-gray-400 hover:bg-[#5380c120] hover:text-[#5380c1]'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-gray-800 pt-6 space-y-2">
        <button className="w-full flex items-center gap-4 px-5 py-4 text-gray-400 hover:bg-gray-800 rounded-xl transition-all">
          <span>❓</span>
          <span className="text-sm font-medium">Support Center</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-900/20 rounded-xl transition-all"
        >
          <span>🚪</span>
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
