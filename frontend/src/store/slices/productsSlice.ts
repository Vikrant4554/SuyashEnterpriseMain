import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductItem {
  _id: string;
  productName: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  salePrice: number;
  nextServiceDate: string;
  customerId: { _id: string; name: string; mobileNumber: string };
}

interface ProductsState {
  list: ProductItem[];
  total: number;
  pages: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ProductsState = {
  list: [],
  total: 0,
  pages: 1,
  status: 'idle',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductsLoading(state) {
      state.status = 'loading';
    },
    setProductsList(
      state,
      { payload }: PayloadAction<{ products: ProductItem[]; total: number; pages: number }>
    ) {
      state.status = 'succeeded';
      state.list = payload.products;
      state.total = payload.total;
      state.pages = payload.pages;
    },
    setProductsFailed(state) {
      state.status = 'failed';
    },
  },
});

export const { setProductsLoading, setProductsList, setProductsFailed } =
  productsSlice.actions;
export default productsSlice.reducer;
