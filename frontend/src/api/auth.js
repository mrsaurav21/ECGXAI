import { apiClient } from './client';

export const registerUser = async (payload) => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};

export const verifyOtp = async (email, otpCode) => {
  const response = await apiClient.post('/auth/verify-otp', { email, otp_code: otpCode });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const loginWithGoogle = async (credential) => {
  const response = await apiClient.post('/auth/google', { token: credential });
  return response.data;
};

export const completeProfile = async (payload) => {
  // Update this path to match your FastAPI backend route (e.g., '/auth/me' or '/users/profile')
  const response = await apiClient.put('/auth/me', payload);
  return response.data;
};