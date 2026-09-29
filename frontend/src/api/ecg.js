import { apiClient } from './client';

export const analyzeEcgFile = async ({ file, patientMrn, samplingRate = 500, doctorNotes = '' }) => {
  const formData = new FormData();
  formData.append('file', file);
  if (patientMrn) formData.append('patient_mrn', patientMrn);
  formData.append('sampling_rate', samplingRate.toString());
  if (doctorNotes) formData.append('doctor_notes', doctorNotes);

  const response = await apiClient.post('/ecg/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getPatientHistory = async (patientMrn) => {
  const params = patientMrn ? { patient_mrn: patientMrn } : {};
  const response = await apiClient.get('/ecg/history', { params });
  
  // FastAPI endpoint returns an object containing the records array: { patient_mrn, total_records, records: [...] }
  return response.data?.records || [];
};

export const getSingleRecord = async (recordId) => {
  if (!recordId) return null;
  const response = await apiClient.get(`/ecg/record/${recordId}`);
  return response.data;
};

// --- Doctor & Patient Assignment APIs ---

export const getAssignedPatients = async () => {
  const response = await apiClient.get('/doctor/patients');
  return response.data;
};

export const assignDoctorToPatient = async (doctorId) => {
  // Allows a patient to optionally select or update their attending physician
  const response = await apiClient.post('/auth/patient/assign-doctor', { doctor_id: doctorId });
  return response.data;
};

export const getAvailableDoctors = async () => {
  // Fixed path to include /auth prefix where the route is registered in FastAPI
  const response = await apiClient.get('/auth/doctors/directory');
  return response.data;
};