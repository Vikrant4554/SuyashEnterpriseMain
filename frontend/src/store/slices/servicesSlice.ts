import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ServiceItem {
  _id: string;
  serviceDate: string;
  workDone: string;
  problemDescription: string;
  partsReplaced: string;
  serviceCharge: number;
  nextServiceDate: string;
  customerId: { _id: string; name: string; mobileNumber: string };
  productId: { _id: string; productName: string; serialNumber: string };
}

interface ServicesState {
  list: ServiceItem[];
  total: number;
  pages: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ServicesState = {
  list: [],
  total: 0,
  pages: 1,
  status: 'idle',
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServicesLoading(state) {
      state.status = 'loading';
    },
    setServicesList(
      state,
      { payload }: PayloadAction<{ services: ServiceItem[]; total: number; pages: number }>
    ) {
      state.status = 'succeeded';
      state.list = payload.services;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    setServicesFailed(state) {
      state.status = 'failed';
    },
  },
});

export const { setServicesLoading, setServicesList, setServicesFailed } =
  servicesSlice.actions;
export default servicesSlice.reducer;
