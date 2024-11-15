import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type BookingData = {
  user_id: string;
  doctor_id: string;
  date: string;
  time: string;
  payment: string;
  address: string;
  reasons: string;
  zaloPhone: string;
  newPatients: boolean;
};

type BookingState = {
  bookingData: BookingData | null;
  isVerifyingPayment: boolean;
  isVerifyingAppointment: boolean;
};

const initialState: BookingState = {
  bookingData: null,
  isVerifyingPayment: false,
  isVerifyingAppointment: false
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingDone: (state) => {
      state.bookingData = null;
      state.isVerifyingPayment = false;
    },
    setBookingData: (state, action: PayloadAction<BookingData>) => {
      state.bookingData = action.payload;
    },
    setVerifyingPayment: (state, action: PayloadAction<boolean>) => {
      state.isVerifyingPayment = action.payload;
    },
    setVerifyingAppointment: (state, action: PayloadAction<boolean>) => {
      state.isVerifyingAppointment = action.payload;
    }
  }
});

export const {
  setBookingDone,
  setBookingData,
  setVerifyingPayment,
  setVerifyingAppointment
} = bookingSlice.actions;
export default bookingSlice.reducer;