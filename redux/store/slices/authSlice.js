// app/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user_id: null,
    user_type: null,
    email_add: null,
    first_name: null,
    last_name: null,
    phone_num: null,
    gender: null,
    date_of_birth: null,
    country: null,
    province: null,
    profile_image: null,
    is_transporter: false,
    is_runner: false,
    transporter_id: null,
    runner_id: null,
    created_at: null,
    is_verified: false,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData: (state, action) => {
            // Assign only keys that exist in state
            Object.entries(action.payload).forEach(([key, value]) => {
                if (state.hasOwnProperty(key) && value !== undefined) {
                    state[key] = value;
                }
            });
            state.isAuthenticated = true;
        },

        logoutUser: (state) => {
            Object.assign(state, initialState);
        },

        updateUserData: (state, action) => {
            // Update only provided keys safely
            Object.entries(action.payload).forEach(([key, value]) => {
                if (state.hasOwnProperty(key) && value !== undefined) {
                    state[key] = value;
                }
            });
            // Keep user authenticated if they still have an ID
            if (state.user_id) {
                state.isAuthenticated = true;
            }
        },
    },
});

// Selectors (optional, but handy to avoid repeating logic in components)
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserFullName = (state) =>
    `${state.auth.first_name ?? ''} ${state.auth.last_name ?? ''}`.trim();
export const selectIsRunner = (state) => !!state.auth.runner_id;
export const selectIsTransporter = (state) => !!state.auth.transporter_id;

export const { setUserData, logoutUser, updateUserData } = authSlice.actions;
export default authSlice.reducer;