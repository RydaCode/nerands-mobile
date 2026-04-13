import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/CartSlice';
import deliveryReducer from './slices/DeliverySlice';
import locationReducer from './slices/locationSlice';
import othersCartReducer from './slices/OthersCartSlice';

const store = configureStore({
  reducer: {
    location: locationReducer,
    cart: cartReducer,
    otherscart: othersCartReducer,
    auth: authReducer,
    delivery: deliveryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;