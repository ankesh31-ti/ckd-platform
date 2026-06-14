import axios from 'axios';
import { Patient, Alert } from '../types';

const BASE = import.meta.env.VITE_API_URL ?? '/api';
const api = axios.create({ baseURL: BASE });

export const PatientAPI = {
  getAll: () => api.get<Patient[]>('/patients').then(r => r.data),
  getById: (id: string) => api.get<Patient>(`/patients/${id}`).then(r => r.data),
  update: (id: string, data: Partial<Patient>) => api.post<Patient>(`/patients/${id}`, data).then(r => r.data),
  bulkImport: (patients: Patient[]) => api.post<{ message: string; patients: Patient[] }>('/patients', patients).then(r => r.data),
  exportAll: () => window.open(`${BASE}/export`, '_blank'),
};

export const AlertAPI = {
  getAll: () => api.get<Alert[]>('/alerts').then(r => r.data),
  markRead: (id: string) => api.post<Alert>(`/alerts/${id}/read`).then(r => r.data),
  markAllRead: () => api.post('/alerts/read-all').then(r => r.data),
  dismiss: (id: string) => api.delete(`/alerts/${id}`).then(r => r.data),
};

export const ChatAPI = {
  send: (message: string, patientContext?: Partial<Patient>) =>
    api.post<{ reply: string; isStub: boolean }>('/chat', { message, patientContext }).then(r => r.data),
};

export const LabDigitizerAPI = {
  upload: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<{ message: string; isStub: boolean; extractedLabs: unknown }>('/lab-digitizer', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
};
