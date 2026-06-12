import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Customer {
  _id: string;
  name: string;
  mobileNumber: string;
  alternateNumber?: string;
  address: string;
  notes?: string;
}
export interface CustomerProduct {
  _id: string;
  productName: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  salePrice: number;
  nextServiceDate: string;
}
export interface CustomerService {
  _id: string;
  serviceDate: string;
  workDone: string;
  problemDescription: string;
  partsReplaced: string;
  serviceCharge: number;
  nextServiceDate: string;
  productId: { productName: string; serialNumber: string } | null;
}

interface CustomersState {
  list: Customer[];
  total: number;
  pages: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  currentCustomer: Customer | null;
  currentProducts: CustomerProduct[];
  currentServices: CustomerService[];
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  currentId: string | null;
}

const initialState: CustomersState = {
  list: [],
  total: 0,
  pages: 1,
  status: 'idle',
  currentCustomer: null,
  currentProducts: [],
  currentServices: [],
  detailStatus: 'idle',
  currentId: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomersLoading(state) {
      state.status = 'loading';
    },
    setCustomersList(
      state,
      { payload }: PayloadAction<{ customers: Customer[]; total: number; pages: number }>
    ) {
      state.status = 'succeeded';
      state.list = payload.customers;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    setCustomersFailed(state) {
      state.status = 'failed';
    },
    setCustomerDetailLoading(state, { payload }: PayloadAction<string>) {
      state.detailStatus = 'loading';
      state.currentId = payload;
    },
    setCustomerDetail(
      state,
      { payload }: PayloadAction<{
        customer: Customer;
        products: CustomerProduct[];
        services: CustomerService[];
      }>
    ) {
      state.detailStatus = 'succeeded';
      state.currentCustomer = payload.customer;
      state.currentProducts = payload.products;
      state.currentServices = payload.services;
    },
    setCustomerDetailFailed(state) {
      state.detailStatus = 'failed';
    },
  },
});

export const {
  setCustomersLoading,
  setCustomersList,
  setCustomersFailed,
  setCustomerDetailLoading,
  setCustomerDetail,
  setCustomerDetailFailed,
} = customersSlice.actions;
export default customersSlice.reducer;
