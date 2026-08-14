import { createSlice } from '@reduxjs/toolkit';

// Helper to load cached allowlist status from localStorage
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

// Helper to load cached Supabase session token from localStorage
const loadCachedSession = () => {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('-auth-token') || key.includes('supabase.auth.token'))) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          const sess = parsed?.currentSession || parsed;
          const user = sess?.user || parsed?.user || null;
          if (user) {
            return {
              session: sess,
              user: user,
              isAuthenticated: true,
            };
          }
        }
      }
    }
  } catch (e) {
    console.error('Failed to load cached session:', e);
  }
  return { session: null, user: null, isAuthenticated: false };
};

const cachedStatus = loadCachedAllowlist();
const cachedSession = loadCachedSession();

const initialState = {
  user: cachedSession.user,
  profile: null,
  session: cachedSession.session,
  isAuthenticated: cachedSession.isAuthenticated,
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
