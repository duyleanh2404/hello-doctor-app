export interface ClinicData {
  _id: string;
  name: string;
  desc: string;
  avatar: string;
  banner: string;
  address: string;
};

export interface ClinicBaseData {
  name: string;
  desc: string;
  address: string;
  avatarName: string;
  bannerName: string;
  accessToken: string;
};

export interface CreateClinicData extends ClinicBaseData {
  avatar?: File;
  banner?: File;
};

export interface UpdateClinicData extends Partial<ClinicBaseData> {
  id: string;
  avatar?: File | null;
  banner?: File | null;
};

export interface DeleteClinicData {
  id: string;
  accessToken: string;
};

export interface GetAllClinicsData {
  page?: number;
  limit?: number;
  query?: string;
  province?: string;
  accessToken: string;
};

export interface GetClinicByIdData {
  id: string;
  accessToken: string;
};