import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  profile: null,
  session: null,
  isAuthenticated: false,
  isAllowlisted: false,
  isAdmin: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
      state.isAuthenticated = !!action.payload;
      state.user = action.payload?.user || null;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setAllowlistStatus: (state, action) => {
      state.isAllowlisted = action.payload.isAllowed;
      state.isAdmin = action.payload.isAdmin;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.profile = null;
      state.session = null;
      state.isAuthenticated = false;
      state.isAllowlisted = false;
      state.isAdmin = false;
      state.loading = false;
    },
  },
});

export const { setSession, setProfile, setAllowlistStatus, setLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;
