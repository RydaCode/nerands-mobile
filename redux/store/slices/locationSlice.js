// store/locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Initial state for location management
const initialState = {
    location: null,
    latitude: null,
    longitude: null,
    locationServicesEnabled: false,
    displayCurrentLocation: 'Fetching location...',
    loading: false, // Tracks if location fetch is in progress
    error: null, // Stores any error message related to location fetching
};

// Create the location slice
const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        startFetchingLocation(state) {
            state.loading = true;
            state.error = null;
            state.displayCurrentLocation = 'Fetching location...';
        },
        setLocation(state, action) {
            state.location = action.payload.location;
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
            state.loading = false;
            state.error = null;
            state.displayCurrentLocation = `Location: ${action.payload.location}`;
        },
        setLocationServicesEnabled(state, action) {
            state.locationServicesEnabled = action.payload;
        },
        setDisplayCurrentLocation(state, action) {
            state.displayCurrentLocation = action.payload;
        },
        setLocationError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.displayCurrentLocation = 'Location unavailable';
        },
    },
});

// Export the actions for use in components
export const { 
    startFetchingLocation, 
    setLocation, 
    setLocationServicesEnabled, 
    setDisplayCurrentLocation, 
    setLocationError 
} = locationSlice.actions;

// Export the reducer to be used in the store
export default locationSlice.reducer;