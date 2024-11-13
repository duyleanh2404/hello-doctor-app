import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormClearErrors
} from "react-hook-form";

import { UserData } from "./user-types";
import { DoctorData } from "./doctor-types";
import { ScheduleData } from "./schedule-types";

export interface BookingData {
  _id: string;
  user_id: string;
  doctor_id: DoctorData;
  date: string;
  time: string;
  address: string;
  reasons: string;
  zaloPhone: string;
  newPatients: boolean;
  doctor: string;
};

export interface ScheduleInfoProps {
  time?: string;
  isBooking: boolean;
  isLoading: boolean;
  paymentMethod: string;
  schedule?: ScheduleData;
  setPaymentMethod: (paymentMethod: string) => void;
};

export interface UserInfoProps {
  isLoading: boolean;
  user: UserData | null;
  control: Control<BookingData>;
  errors: FieldErrors<BookingData>;
  setValue: UseFormSetValue<BookingData>;
  register: UseFormRegister<BookingData>;
  clearErrors: UseFormClearErrors<BookingData>;
};