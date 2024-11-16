export type ClinicData = {
  _id: string;
  name: string;
  address: string;
  desc: string;
  avatar: string;
  banner: string;
};

export type CreateClinicForm = {
  _id?: string;
  name: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  desc: string;
  avatar: FileList;
  banner: FileList;
};

export type EditClinicForm = {
  _id: string;
  name?: string;
  street?: string;
  ward?: string;
  district?: string;
  province?: string;
  desc?: string;
  avatar?: FileList;
  banner?: FileList;
};

export type CreateClinicData = {
  name: string;
  address: string;
  desc: string;
  avatarName: string;
  bannerName: string;
  avatar: File;
  banner: File;
};

export type EditClinicData = {
  id: string;
  name?: string;
  address?: string;
  desc?: string;
  avatarName?: string;
  bannerName?: string;
  avatar?: File;
  banner?: File;
};

export type GetAllClinicsData = {
  page?: number;
  limit?: number;
  query?: string;
  exclude?: string;
  province?: string;
};