import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchCustomer {
  _id: string;
  name: string;
  mobileNumber: string;
  alternateNumber?: string;
  address: string;
  notes?: string;
}

interface SearchState {
  results: SearchCustomer[];
  searched: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: SearchState = { results: [], searched: false, status: 'idle' };

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchLoading(state) {
      state.status = 'loading';
    },
    setSearchResults(state, { payload }: PayloadAction<SearchCustomer[]>) {
      state.status = 'succeeded';
      state.results = payload;
      state.searched = true;
    },
    setSearchFailed(state) {
      state.status = 'failed';
    },
    clearSearch(state) {
      state.results = [];
      state.searched = false;
      state.status = 'idle';
    },
  },
});

export const { setSearchLoading, setSearchResults, setSearchFailed, clearSearch } =
  searchSlice.actions;
export default searchSlice.reducer;
