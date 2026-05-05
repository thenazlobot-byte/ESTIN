import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'customer' | 'admin';
}

interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  pet_name: string;
  pet_type: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  reason: string;
  health_booklet_url?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  pets: any[];
  appointments: Appointment[];
  registeredUsers: User[];
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  registerNewUser: (userData: Omit<User, 'id' | 'role'>) => void;
  setAuth: (user: User, token: string) => void;
  updateUser: (userData: Partial<User>) => void;
  addPet: (pet: any) => void;
  bookAppointment: (appt: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: 'confirmed' | 'cancelled') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      pets: [],
      appointments: [
        {
          id: '1',
          customer_name: 'Pet Owner',
          customer_phone: '0661 99 88 77',
          customer_email: 'customer@petcare.com',
          pet_name: 'Buddy',
          pet_type: 'Dog',
          appointment_date: '2026-10-15',
          appointment_time: '10:00 - 10:30',
          status: 'pending',
          reason: 'Vomiting and lethargy since morning.'
        }
      ],
      registeredUsers: [
        { id: 'demo-id-customer', email: 'customer@petcare.com', full_name: 'Pet Owner', phone: '0661 99 88 77', role: 'customer' }
      ],
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 800));
          if (email === 'admin@petcare.com' || email === 'customer@petcare.com') {
            const role = email.includes('admin') ? 'admin' : 'customer';
            const demoUser: User = {
              id: 'demo-id-' + role,
              email,
              full_name: role === 'admin' ? 'Dr. Amine Kaci' : 'Pet Owner',
              phone: role === 'admin' ? '0550 11 22 33' : '0661 99 88 77',
              role
            };
            
            if (role === 'customer') {
              set((state) => {
                const exists = state.registeredUsers.some(u => u.email === demoUser.email);
                if (!exists) {
                  return { registeredUsers: [...state.registeredUsers, demoUser] };
                }
                return {};
              });
            }

            set({ user: demoUser, token: 'demo-token-' + Date.now(), isLoading: false });
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (err) {
          set({ error: (err as Error).message, isLoading: false });
          throw err;
        }
      },

      registerNewUser: (userData) => set((state) => ({
        registeredUsers: [
          ...state.registeredUsers,
          { ...userData, id: Math.random().toString(36).substr(2, 9), role: 'customer' }
        ]
      })),

      setAuth: (user, token) => {
        set({ user, token });
        set((state) => {
          const exists = state.registeredUsers.some(u => u.email === user.email);
          if (!exists) {
            return { registeredUsers: [...state.registeredUsers, user] };
          }
          return {};
        });
      },
      
      updateUser: (userData) => set((state) => ({ 
        user: state.user ? { ...state.user, ...userData } : null 
      })),
      
      addPet: (pet) => set((state) => ({ 
        pets: [...state.pets, { ...pet, id: Math.random().toString(36).substr(2, 9) }] 
      })),

      bookAppointment: (appt) => set((state) => ({
        appointments: [
          ...state.appointments, 
          { 
            ...appt, 
            id: Math.random().toString(36).substr(2, 9), 
            status: 'pending' 
          }
        ]
      })),

      updateAppointmentStatus: (id, status) => set((state) => ({
        appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a)
      })),
      
      logout: () => {
        set({ user: null, token: null, error: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
