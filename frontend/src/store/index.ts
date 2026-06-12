import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import customersReducer from './slices/customersSlice';
import productsReducer from './slices/productsSlice';
import servicesReducer from './slices/servicesSlice';
import serviceDueReducer from './slices/serviceDueSlice';
import searchReducer from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    customers: customersReducer,
    products: productsReducer,
    services: servicesReducer,
    serviceDue: serviceDueReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
