import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  email: string;
  user_name: string;
  role: string;
  is_new_user?: boolean;
  wallet_address: string;
  daily_login_streak_count: number;
  airdrops_remaining: number;
  airdrops_earned: number;
  profile_image: string
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
  if (state.user) {
    state.user = { ...state.user, ...action.payload };
  }
},
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
