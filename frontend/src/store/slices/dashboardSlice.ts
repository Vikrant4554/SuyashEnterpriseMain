import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalServices: number;
  servicesDueThisMonth: number;
}
export interface RecentService {
  _id: string;
  serviceDate: string;
  workDone: string;
  serviceCharge: number;
  customerId: { name: string; mobileNumber: string };
  productId: { productName: string; serialNumber: string };
}
export interface UpcomingProduct {
  _id: string;
  productName: string;
  nextServiceDate: string;
  customerId: { name: string; mobileNumber: string };
}

interface DashboardState {
  stats: DashboardStats | null;
  recentServices: RecentService[];
  upcomingServices: UpcomingProduct[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: DashboardState = {
  stats: null,
  recentServices: [],
  upcomingServices: [],
  status: 'idle',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardLoading(state) {
      state.status = 'loading';
    },
    setDashboardData(
      state,
      { payload }: PayloadAction<{
        stats: DashboardStats;
        recentServices: RecentService[];
        upcomingServices: UpcomingProduct[];
      }>
    ) {
      state.status = 'succeeded';
      state.stats = payload.stats;
      state.recentServices = payload.recentServices;
      state.upcomingServices = payload.upcomingServices;
    },
    setDashboardFailed(state) {
      state.status = 'failed';
    },
  },
});

export const { setDashboardLoading, setDashboardData, setDashboardFailed } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
