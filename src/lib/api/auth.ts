import {api} from '@/lib/axios';
import { NewUser, LoginUser } from '@/types/api';

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

export const refreshToken = async () => {}
export const getCurrentUser = async () => {}

export const updateUser = async () => {}

