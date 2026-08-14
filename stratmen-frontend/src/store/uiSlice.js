import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  mobileSidebarOpen: false,
  theme: 'dark',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    closeMobileSidebar: (state) => {
      state.mobileSidebarOpen = false;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, toggleMobileSidebar, closeMobileSidebar, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
