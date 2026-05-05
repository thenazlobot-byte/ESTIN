import { create } from 'zustand';

export interface Appointment {
  id: string;
  owner_id: string;
  vet_id: string;
  pet_name: string;
  pet_type: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  file_path?: string;
  created_at: string;
  veterinarians?: {
    name: string;
    specialty: string;
  };
}

interface AppointmentStore {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
  fetchAppointments: () => Promise<void>;
  setAppointments: (appointments: Appointment[]) => void;
  setCurrentAppointment: (appointment: Appointment | null) => void;
  addAppointment: (appointment: Appointment) => void;
}

export const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  currentAppointment: null,
  isLoading: false,
  error: null,
  
  fetchAppointments: async () => {
    set({ isLoading: true, error: null });
    try {
      // Implementation will be added when API service is connected
      console.log('Fetching appointments...');
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  setAppointments: (appointments) => set({ appointments }),
  setCurrentAppointment: (appointment) => set({ currentAppointment: appointment }),
  addAppointment: (appointment) => set((state) => ({
    appointments: [...state.appointments, appointment]
  }))
}));
