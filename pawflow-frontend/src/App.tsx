import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import BookingFlow from './pages/BookingFlow';
import SettingsPage from './pages/SettingsPage';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/PaymentPage';
import PetAdoptionPage from './pages/PetAdoptionPage';
import AddPetPage from './pages/AddPetPage';
import { 
  PetCarePage, PetShopPage, PetHelpPage, 
  HistoryPage, TeamPage, TermsPage, BookingGuidePage 
} from './pages/StaticPages';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const user = useAuthStore((state) => state.user);
  if (user?.role === 'admin') return <AdminDashboard />;
  return <Dashboard />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/adoption" element={<PetAdoptionPage />} />
        <Route path="/add-pet" element={<AddPetPage />} />
        <Route path="/pet-care" element={<PetCarePage />} />
        <Route path="/pet-shop" element={<PetShopPage />} />
        <Route path="/pet-help" element={<PetHelpPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/booking-guide" element={<BookingGuidePage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingFlow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
