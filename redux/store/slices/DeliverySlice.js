// store/slices/DeliverySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    charges: null,      // Frozen charges fetched from API
    lastFetchedAt: null // Timestamp (optional)
};

const deliverySlice = createSlice({
    name: 'delivery',
    initialState,
    reducers: {
        setCharges: (state, action) => {
            state.charges = action.payload;
            state.lastFetchedAt = Date.now();
        },
        clearCharges: (state) => {
            state.charges = null;
            state.lastFetchedAt = null;
        }
    }
});

export const { setCharges, clearCharges } = deliverySlice.actions;
export default deliverySlice.reducer;