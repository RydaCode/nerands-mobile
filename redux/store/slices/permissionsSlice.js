import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    business: null,
    role: null,

    // O(1) permission lookup
    permissions: {}
};

const permissionsSlice = createSlice({
    name: 'permissions',
    initialState,

    reducers: {
        setBusiness: (state, action) => {
            state.business = action.payload;
        },

        setRole: (state, action) => {
            state.role = action.payload;
        },

        setPermissions: (state, action) => {
            state.permissions = action.payload;
        },

        clearPermissions: (state) => {
            state.permissions = {};
        },

        clearBusinessContext: () => initialState
    }
});

export const {
    setBusiness,
    setRole,
    setPermissions,
    clearPermissions,
    clearBusinessContext
} = permissionsSlice.actions;

export default permissionsSlice.reducer;