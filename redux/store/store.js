import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/CartSlice';
import CustomOrdersCartReducer from './slices/CustomOrdersCartSlice';
import deliveryReducer from './slices/DeliverySlice';
import localMarketCartReducer from './slices/LocalMarketCartSlice';
import locationReducer from './slices/locationSlice';
import notificationReducer from "./slices/notificationSlice";
import othersCartReducer from './slices/OthersCartSlice';
import permissionsReducer from './slices/permissionsSlice';

const store = configureStore({
  reducer: {
    location: locationReducer,
    cart: cartReducer,
    otherscart: othersCartReducer,
    auth: authReducer,
    permissions: permissionsReducer,
    delivery: deliveryReducer,
    customcart: CustomOrdersCartReducer,
    localmarketcart: localMarketCartReducer,
    notifications: notificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;