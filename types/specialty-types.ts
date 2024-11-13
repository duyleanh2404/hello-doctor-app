export interface SpecialtyData {
  _id: string;
  name: string;
  desc: string;
  image: string;
};

export interface CreateSpecialtyForm {
  _id?: string;
  name: string;
  desc: string;
  image: FileList;
};

export interface EditSpecialtyForm {
  _id?: string;
  name: string;
  desc: string;
  image?: FileList;
};

export interface CreateSpecialtyData {
  name: string;
  desc: string;
  image?: File;
  imageName: string;
};

export interface EditSpecialtyData {
  id: string;
  name?: string;
  desc?: string;
  image?: File;
  imageName?: string;
};

export interface GetAllSpecialtiesData {
  page?: number;
  limit?: number;
  query?: string;
  exclude?: string;
};