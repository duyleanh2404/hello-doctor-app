import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommonState {
  isBannerVisible: boolean;
};

const initialState: CommonState = {
  isBannerVisible: true
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setIsBannerVisible: (state, action: PayloadAction<boolean>) => {
      state.isBannerVisible = action.payload;
    }
  }
});

export const { setIsBannerVisible } = commonSlice.actions;
export default commonSlice.reducer;