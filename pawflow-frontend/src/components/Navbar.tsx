import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Navbar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-24">
            <img src="/logo.png" alt="PetCare" />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-teal-700 text-sm">
            Fonctionnalités
          </a>
          <a href="#about" className="text-gray-600 hover:text-teal-700 text-sm">
            À propos
          </a>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold"
              >
                {user.full_name?.charAt(0).toUpperCase()}
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-teal-700 hover:text-teal-900 font-medium text-sm"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 text-sm font-medium"
              >
                S'inscrire
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
