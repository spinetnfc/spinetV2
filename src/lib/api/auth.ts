import { api } from '@/lib/axios';
import { NewUser, LoginUser } from '@/types/auth';

export const registerUser = async (user: NewUser) => {
  try {
    const response = await api.post('/auth/signup', user);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (user: LoginUser) => {
  try {
    const response = await api.post('/auth/signin', user);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const response = await api.post('/auth/signout');
    return response.data;
  } catch (error) {
    console.error('Log-out error:', error);
    throw error;
  }
}

export const refreshToken = async (): Promise<{ message: string }> => {
  try {
    const response = await api.post('/auth/refresh');
    return response.data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

export const verifyOTP = async (sessionId: string, code: string) => {
  try {
    const response = await api.post(`/auth/confirm-code/${sessionId}`, { code });
    return response.data;
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
}

export const resetPassword = async (sessionId: string, password: string) => {
  try {
    const response = await api.post(`/auth/reset-password/${sessionId}`, { password });
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}
