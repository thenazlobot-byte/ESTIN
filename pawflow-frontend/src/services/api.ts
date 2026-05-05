import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  signup(email: string, password: string, full_name: string, phone: string) {
    return this.client.post('/signup', {
      email,
      password,
      full_name,
      phone,
    });
  }

  login(email: string, password: string) {
    return this.client.post('/login', {
      email,
      password,
    });
  }

  logout() {
    return this.client.post('/logout');
  }

  // Profile endpoints
  getProfile() {
    return this.client.get('/profile');
  }

  updateProfile(data: { full_name?: string; phone?: string }) {
    return this.client.patch('/profile', data);
  }

  // Vets endpoints
  getVets() {
    return this.client.get('/vets');
  }

  // Appointments endpoints
  getAppointments() {
    return this.client.get('/appointments');
  }

  createAppointment(data: {
    vet_id: string;
    pet_name: string;
    pet_type?: string;
    appointment_date: string;
    appointment_time: string;
    reason?: string;
    health_booklet_url?: string;
  }) {
    return this.client.post('/appointments', data);
  }

  updateAppointment(id: string, data: { status?: string }) {
    return this.client.patch(`/appointments/${id}`, data);
  }

  deleteAppointment(id: string) {
    return this.client.delete(`/appointments/${id}`);
  }

  uploadHealthRecord(appointmentId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.client.post(`/appointments/${appointmentId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  getHealthRecord(filePath: string, token: string) {
    return `${API_BASE_URL}/storage/v1/object/authenticated/pet_records/${filePath}`;
  }
}

export const apiService = new ApiService();

