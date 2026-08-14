import { createSlice } from '@reduxjs/toolkit';

// Helper to load cached allowlist status from localStorage for instant reload persistence
const loadCachedAllowlist = () => {
  try {
    const cached = localStorage.getItem('stratmen_allowlist_status');
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        isAllowlisted: !!parsed.isAllowed,
        isAdmin: !!parsed.isAdmin,
      };
    }
  } catch (e) {
    console.error('Failed to load cached allowlist status:', e);
  }
  return { isAllowlisted: false, isAdmin: false };
};

const cachedStatus = loadCachedAllowlist();

const initialState = {
  user: null,
  profile: null,
  session: null,
  isAuthenticated: false,
  isAllowlisted: cachedStatus.isAllowlisted,
  isAdmin: cachedStatus.isAdmin,
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
      state.isAllowlisted = !!action.payload.isAllowed;
      state.isAdmin = !!action.payload.isAdmin;
      try {
        localStorage.setItem(
          'stratmen_allowlist_status',
          JSON.stringify({
            isAllowed: action.payload.isAllowed,
            isAdmin: action.payload.isAdmin,
          })
        );
      } catch (e) {
        console.error('Failed to cache allowlist status:', e);
      }
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
      try {
        localStorage.removeItem('stratmen_allowlist_status');
      } catch (e) {
        console.error('Failed to clear cached allowlist status:', e);
      }
    },
  },
});

export const { setSession, setProfile, setAllowlistStatus, setLoading, clearAuth } = authSlice.actions;
export default authSlice.reducer;
