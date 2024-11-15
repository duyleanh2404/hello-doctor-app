export type SpecialtyData = {
  _id: string;
  name: string;
  desc: string;
  image: string;
};

export type CreateSpecialtyForm = {
  _id: string;
  name: string;
  desc: string;
  image: FileList;
};

export type EditSpecialtyForm = {
  _id: string;
  name?: string;
  desc?: string;
  image?: FileList;
};

export type CreateSpecialtyData = {
  name: string;
  desc: string;
  image: File;
  imageName: string;
};

export type EditSpecialtyData = {
  id: string;
  name?: string;
  desc?: string;
  image?: File;
  imageName?: string;
};

export type GetAllSpecialtiesData = {
  page?: number;
  limit?: number;
  query?: string;
  exclude?: string;
};