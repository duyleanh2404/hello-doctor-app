import { ClinicData } from "./clinic-types";
import { SpecialtyData } from "./specialty-types";

export type DoctorData = {
  _id: string;
  clinic_id: ClinicData;
  specialty_id: SpecialtyData;
  clinic: string;
  specialty: string;
  fullname: string;
  province: string;
  medicalFee: number;
  desc: string;
  image: string;
};

export type CreateDoctorForm = {
  clinic_id: string;
  specialty_id: string;
  fullname: string;
  province: string;
  medicalFee: number;
  desc: string;
  image: FileList;
};

export type EditDoctorForm = {
  clinic_id?: string;
  specialty_id?: string;
  fullname?: string;
  province?: string;
  medicalFee?: number;
  desc?: string;
  image?: FileList;
};

export type CreateDoctorData = {
  clinic_id: string;
  specialty_id: string;
  fullname: string;
  province: string;
  medicalFee: number;
  desc: string;
  imageName: string;
  image: File;
};

export type EditDoctorData = {
  id: string;
  clinic_id?: string;
  specialty_id?: string;
  fullname?: string;
  province?: string;
  medicalFee?: number;
  desc?: string;
  imageName?: string;
  image?: File;
};

export type GetAllDoctorsData = {
  page?: number;
  limit?: number;
  clinic_id?: string;
  specialty_id?: string;
  query?: string;
  exclude?: string;
  province?: string;
};