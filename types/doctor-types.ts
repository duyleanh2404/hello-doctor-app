import { ClinicData } from "./clinic-types";
import { SpecialtyData } from "./specialty-types";

export interface DoctorData {
  _id: string;
  fullname: string;
  province: string;
  desc: string;
  image: string;
  medical_fee: number;
  clinic_data: ClinicData;
  specialty_data: SpecialtyData;
};