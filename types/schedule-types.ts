import { DoctorData } from "./doctor-types";

export interface BookingScheduleData {
  _id: string;
  date: string;
  time: string;
  zalo: string;
  address: string;
  reasons: string;
  user_id: string;
  doctor_id: string;
  new_patients: boolean;
  doctor_data: DoctorData;
};