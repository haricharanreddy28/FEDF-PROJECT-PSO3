import { User, UserRole } from '../types';
import { getUsers, setCurrentUser, getCurrentUser } from './storage';
import api from './api';

export const registerUser = async (name: string, email: string, password: string, role: UserRole): Promise<{ success: boolean; message: string }> => {
  try {
    // Validate password
    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    const response = await api.post('/auth/register', { name, email, password, role });
    
    if (response.data.success) {
      return { success: true, message: 'Registration successful' };
    }
    
    return { success: false, message: response.data.message || 'Registration failed' };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Registration failed. Please try again.' 
    };
  }
};

export const loginUser = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User; token?: string }> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.success) {
      const { token, user } = response.data;
      
      // Store token
      localStorage.setItem('auth_token', token);
      
      // Store user in session
      const userData: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: '', // Don't store password
        role: user.role,
        createdAt: new Date().toISOString(),
      };
      
      setCurrentUser(userData);
      
      return { success: true, message: 'Login successful', user: userData, token };
    }
    
    return { success: false, message: response.data.message || 'Login failed' };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed. Please check your credentials.' 
    };
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem('auth_token');
  setCurrentUser(null);
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const getCurrentUserRole = (): UserRole | null => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

