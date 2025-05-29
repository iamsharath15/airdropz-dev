'use client';

import axios from 'axios';
import { toast } from 'sonner';
import { AppDispatch } from '@/store';
import { logout as logoutAction } from '@/store/authSlice';

export const logoutUser = async (dispatch: AppDispatch) => {
  try {
    await axios.post('http://localhost:8080/api/auth/v1/logout');
    toast.success('Logged out successfully');

    dispatch(logoutAction()); // clear redux state

    localStorage.removeItem('token'); // if used
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout failed:', error);
    toast.error('Logout failed');
  }
};
