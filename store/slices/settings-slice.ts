import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserData } from "@/types/user-types";

interface SettingsState {
  user: UserData | null;
  openMenuMobile: boolean;
  isInfoChanged: boolean;
};

const initialState: SettingsState = {
  user: null,
  openMenuMobile: false,
  isInfoChanged: false
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData | null>) {
      state.user = action.payload;
    },
    setOpenMenuMobile(state, action: PayloadAction<boolean>) {
      state.openMenuMobile = action.payload;
    },
    setIsInfoChanged: (state, action: PayloadAction<boolean>) => {
      state.isInfoChanged = action.payload;
    }
  }
});

export const {
  setUser,
  setOpenMenuMobile,
  setIsInfoChanged
} = settingsSlice.actions;
export default settingsSlice.reducer;