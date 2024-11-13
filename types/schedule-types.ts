import { ClinicData } from "./clinic-types";
import { DoctorData } from "./doctor-types";
import { SpecialtyData } from "./specialty-types";

export interface ScheduleData {
  _id: string;
  doctor_id: DoctorData;
  clinic_id: ClinicData;
  specialty_id: SpecialtyData;
  date?: Date;
  timeSlots: TimeSlot[];
};

export interface TimeSlot {
  timeline: string;
  isBooked: boolean;
};

export interface CreateScheduleData {
  doctor_id: string;
  date: Date;
  timeSlots: TimeSlot[];
};

export interface EditScheduleData {
  id: string;
  doctor_id?: string;
  date?: Date;
  timeSlots?: Array<{
    timeline: string;
    isBooked?: boolean;
  }>;
};

export interface GetAllSchedulesData {
  page?: number;
  limit?: number;
  query?: string;
  exclude?: string;
  date?: Date;
};

export interface GetSchedulesByRange {
  doctor_id?: string;
  startDate?: Date;
  endDate?: Date;
};

export interface GetScheduleData {
  doctor_id?: string;
  schedule_id?: string;
  date?: Date;
};