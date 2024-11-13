import { ClinicData } from "./clinic-types";
import { SpecialtyData } from "./specialty-types";

export interface DoctorData {
  _id: string;
  clinic_id: ClinicData;
  specialty_id: SpecialtyData;
  clinic: string;
  specialty: string;
  fullname: string;
  desc: string;
  province: string;
  medicalFee: number;
  image: string;
};

export interface CreateDoctorForm {
  clinic_id: string;
  specialty_id: string;
  fullname: string;
  desc: string;
  province: string;
  medicalFee: number;
  imageName: string;
  image: FileList;
};

export interface EditDoctorForm {
  clinic_id: string;
  specialty_id: string;
  fullname: string;
  desc: string;
  province: string;
  medicalFee: number;
  imageName?: string;
  image?: FileList;
};

export interface CreateDoctorData {
  clinic_id: string;
  specialty_id: string;
  fullname: string;
  desc: string;
  province: string;
  medicalFee: number;
  imageName: string;
  image: File;
};

export interface EditDoctorData {
  id: string;
  clinic_id: string;
  specialty_id: string;
  fullname?: string;
  desc?: string;
  province?: string;
  medicalFee?: number;
  imageName?: string;
  image?: File;
};

export interface GetAllDoctorsData {
  page?: number;
  limit?: number;
  clinic_id?: string;
  specialty_id?: string;
  query?: string;
  exclude?: string;
  province?: string;
};