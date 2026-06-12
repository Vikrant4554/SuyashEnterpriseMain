import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ServiceDueItem {
  _id: string;
  productName: string;
  nextServiceDate: string;
  customerId: { _id: string; name: string; mobileNumber: string; address: string };
}

interface ServiceDueState {
  list: ServiceDueItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ServiceDueState = { list: [], status: 'idle' };

const serviceDueSlice = createSlice({
  name: 'serviceDue',
  initialState,
  reducers: {
    setServiceDueLoading(state) {
      state.status = 'loading';
    },
    setServiceDueList(state, { payload }: PayloadAction<ServiceDueItem[]>) {
      state.status = 'succeeded';
      state.list = payload;
    },
    setServiceDueFailed(state) {
      state.status = 'failed';
    },
  },
});

export const { setServiceDueLoading, setServiceDueList, setServiceDueFailed } =
  serviceDueSlice.actions;
export default serviceDueSlice.reducer;
