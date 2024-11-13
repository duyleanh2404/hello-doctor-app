export interface ClinicData {
  _id: string;
  name: string;
  address: string;
  desc: string;
  avatar: string;
  banner: string;
};

export interface CreateClinicForm {
  _id?: string;
  name: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  desc: string;
  avatar?: FileList;
  banner?: FileList;
};

export interface EditClinicForm {
  _id?: string;
  name: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  desc: string;
  avatar?: FileList;
  banner?: FileList;
};

export interface CreateClinicData {
  name: string;
  address: string;
  desc: string;
  avatarName: string;
  bannerName: string;
  avatar?: File;
  banner?: File;
};

export interface EditClinicData {
  id: string;
  name?: string;
  address?: string;
  desc?: string;
  avatarName?: string;
  bannerName?: string;
  avatar?: File;
  banner?: File;
};

export interface GetAllClinicsData {
  page?: number;
  limit?: number;
  query?: string;
  exclude?: string;
  province?: string;
};