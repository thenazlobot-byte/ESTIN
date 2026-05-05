import { Sidebar } from './Sidebar';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSidebarItem?: string;
}

export const DashboardLayout = ({ children, activeSidebarItem }: DashboardLayoutProps) => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar activeItem={activeSidebarItem} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-end px-10 shrink-0">
          <div className="flex items-center gap-6">
            <button className="text-xs font-bold text-gray-400 hover:text-[#5380c1] transition-colors border-r pr-6 border-gray-100">
              EN / FR
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#343434]">{user?.full_name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user?.role}</p>
              </div>
              <Link 
                to="/settings" 
                className="w-12 h-12 rounded-full bg-[#5380c1] text-white flex items-center justify-center font-bold text-xl shadow-lg hover:scale-110 transition-transform border-2 border-white"
                title="Profile Settings"
              >
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
