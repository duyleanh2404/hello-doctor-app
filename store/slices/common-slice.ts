import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommonState {
}

const initialState: CommonState = {
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {}
});

export const { } = commonSlice.actions;
export default commonSlice.reducer;