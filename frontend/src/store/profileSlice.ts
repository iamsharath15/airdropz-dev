import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Profile {
  user_name: string;
  email: string;
  profile_image: string | null;
  referral_code: string;
  daily_login_streak_count: number;
  airdrops_earned: number;
  airdrops_remaining: number;
  heard_from: string;
  interests: string;
  experience_level: string;
  wallet_address: string;
  new_airdrop_alerts: boolean;
  weekly_reports: boolean;
  task_reminders: boolean;
  mode: string;
  language: string;
}

interface ProfileState {
  data: Profile | null;
}

const initialState: ProfileState = {
  data: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Partial<Profile>>) {
      state.data = {
         ...(state.data as Profile),
        ...action.payload,
      }
    },
    clearProfile(state) {
      state.data = null;
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
