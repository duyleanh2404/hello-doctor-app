import { ClinicData } from "./clinic-types";
import { DoctorData } from "./doctor-types";
import { SpecialtyData } from "./specialty-types";

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

export interface ScheduleData {
  _id: string;
  accessToken: string;
  doctor_id: DoctorData;
  date: string | undefined;
  timeSlots: TimeSlot[];
  specialty_id: SpecialtyData;
  clinic_id: ClinicData
};

export interface TimeSlot {
  type: string;
  timeline: string;
  isBooked: boolean;
};

export interface CreateNewScheduleData {
  accessToken: string;
  doctor_id: string;
  date: string | undefined;
  timeSlots: TimeSlot[];
};

export interface DeleteScheduleData {
  id: string;
  accessToken: string;
};

export interface GetAllSchedulesData {
  accessToken: string;
  page?: number;
  limit?: number;
  query?: string;
  date?: string;
};

export interface GetScheduleByIdData {
  id: string;
  accessToken: string;
};

export interface UpdateScheduleData {
  accessToken: string;
  id: string;
  doctor_id?: string;
  date?: string;
  timeSlots?: Array<{
    type: string;
    timeline: string;
    isBooked?: boolean;
  }>;
}