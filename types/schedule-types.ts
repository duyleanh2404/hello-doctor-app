import { ClinicData } from "./clinic-types";
import { DoctorData } from "./doctor-types";
import { SpecialtyData } from "./specialty-types";

export type ScheduleData = {
  _id: string;
  doctor_id: DoctorData;
  clinic_id: ClinicData;
  specialty_id: SpecialtyData;
  date: Date;
  timeSlots: TimeSlot[];
};

export type TimeSlot = {
  timeline: string;
  isBooked: boolean;
};

export type CreateScheduleData = {
  doctor_id: string;
  date: Date;
  timeSlots: TimeSlot[];
};

export type EditScheduleData = {
  id: string;
  doctor_id?: string;
  date?: Date;
  timeSlots?: Array<TimeSlot>;
};

export type GetAllSchedulesData = {
  page?: number;
  limit?: number;
  query?: string;
  exclude?: string;
  date?: Date;
};

export type GetSchedulesByRangeData = {
  doctor_id?: string;
  startDate?: Date;
  endDate?: Date;
};

export type GetScheduleData = {
  doctor_id?: string;
  schedule_id?: string;
  date?: Date;
};