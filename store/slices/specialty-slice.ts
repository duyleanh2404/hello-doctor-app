import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SpecialtyState {
  currentPage: number;
  totalPages: number;
};

const initialState: SpecialtyState = {
  currentPage: 1,
  totalPages: 1
};

const specialtySlice = createSlice({
  name: "specialty",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    }
  }
});

export const { setCurrentPage, setTotalPages } = specialtySlice.actions;
export default specialtySlice.reducer;