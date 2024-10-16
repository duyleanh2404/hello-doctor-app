import { ClinicData } from "./clinic-types";
import { SpecialtyData } from "./specialty-types";

export interface DoctorData {
  _id: string;
  desc: string;
  clinic: string;
  fullname: string;
  province: string;
  specialty: string;
  medicalFee: number;
  clinic_id: ClinicData;
  image: FileList | null;
  specialty_id: SpecialtyData;
};

export interface CreateNewDoctorData {
  desc: string;
  fullname: string;
  province: string;
  clinic_id: string;
  imageName: string;
  medical_fee: number;
  accessToken: string;
  specialty_id: string;
  image: File | undefined;
};

export interface DeleteDoctorData {
  id: string;
  accessToken: string;
};

export interface GetAllDoctorsData {
  page?: number;
  limit?: number;
  query?: string;
  clinic?: string;
  province?: string;
  specialty?: string;
  accessToken: string;
};

export interface GetDoctorByIdData {
  id: string;
  accessToken: string;
};

export interface UpdateDoctorData {
  id: string;
  image?: File;
  desc?: string;
  fullname?: string;
  province?: string;
  clinic_id: string;
  imageName?: string;
  accessToken: string;
  medical_fee?: number;
  specialty_id: string;
};