// done v1
'use client';

import axios from 'axios';
import { toast } from 'sonner';

export const logout = async (): Promise<void> => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/v1/logout`);
    toast.success('Logged out successfully');
  } catch (error) {
    console.error('Logout failed:', error);
    toast.error('Logout failed');
  }
};
