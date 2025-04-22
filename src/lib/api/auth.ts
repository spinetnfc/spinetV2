import api from '@/lib/axios';
import { NewUser, LoginUser } from '@/types/api';

export const register = async (user: NewUser) => {
  const response = await api.post('/auth/register', user);
  return response.data;
};

export const login = async (user: LoginUser) => {
  const response = await api.post('/auth/login', user);
  return response.data;
};

export const logout = async () => {}

export const refreshToken = async () => {}
export const getCurrentUser = async () => {}

export const updateUser = async () => {}

