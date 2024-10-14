export interface SpecialtyData {
  _id: string;
  name: string;
  desc: string;
  image: string;
};

export interface SpecialtyBaseData {
  name: string;
  desc: string;
  imageName: string;
  accessToken: string;
};

export interface CreateSpecialtyData extends SpecialtyBaseData {
  image?: File;
};

export interface UpdateSpecialtyData extends Partial<SpecialtyBaseData> {
  id: string;
  image?: File | null;
};

export interface DeleteSpecialtyData {
  id: string;
  accessToken: string;
};

export interface GetAllSpecialtiesData {
  page?: number;
  limit?: number;
  query?: string;
  accessToken: string;
};

export interface SearchSpecialtiesData {
  name: string;
  page?: number;
  limit?: number;
  accessToken: string;
};

export interface GetSpecialtyByIdData {
  id: string;
  accessToken: string;
};