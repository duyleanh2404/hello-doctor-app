import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  openMenuMobile: boolean;
  isInfoChanged: boolean;
};

const initialState: SettingsState = {
  openMenuMobile: false,
  isInfoChanged: false
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setOpenMenuMobile(state, action: PayloadAction<boolean>) {
      state.openMenuMobile = action.payload;
    },
    setIsInfoChanged: (state, action: PayloadAction<boolean>) => {
      state.isInfoChanged = action.payload;
    }
  }
});

export const { setOpenMenuMobile, setIsInfoChanged } = settingsSlice.actions;
export default settingsSlice.reducer;