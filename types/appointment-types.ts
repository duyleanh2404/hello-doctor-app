import { UserData } from "./user-types";
import { DoctorData } from "./doctor-types";

export interface AppointmentData {
  _id: string;
  user_id: UserData;
  doctor_id: DoctorData;
  date: Date;
  time: string;
  payment: string;
  address: string;
  reasons: string;
  zaloPhone: string;
  newPatients: boolean;
  token: string;
  isVerified: boolean;
  isFinished: boolean;
};

export interface CreateAppointmentData {
  user_id: string;
  doctor_id: string;
  date: Date;
  time: string;
  payment: string;
  address: string;
  reasons: string;
  zaloPhone: string;
  newPatients: boolean;
};

export interface GetAllAppointmentsData {
  page?: number;
  limit?: number;
  user_id?: string;
  doctor_id?: string;
  query?: string;
  date?: Date;
};