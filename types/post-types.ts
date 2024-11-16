import { DoctorData } from "./doctor-types";
import { SpecialtyData } from "./specialty-types";

export type PostData = {
  _id: string;
  doctor_id: DoctorData;
  specialty_id: SpecialtyData;
  doctor: string;
  specialty: string;
  title: string;
  releaseDate: string;
  desc: string;
  imageName: string;
  image: string;
};

export type CreatePostForm = {
  doctor_id: string;
  specialty_id: string;
  title: string;
  releaseDate: string;
  desc: string;
  imageName: string;
  image: FileList;
};

export type EditPostForm = {
  doctor_id?: string;
  specialty_id?: string;
  title?: string;
  releaseDate?: string;
  desc?: string;
  imageName?: string;
  image?: FileList;
};

export type CreatePostData = {
  doctor_id: string;
  specialty_id: string;
  title: string;
  releaseDate: string;
  desc: string;
  imageName: string;
  image: File;
};


export type EditPostData = {
  id: string;
  doctor_id?: string;
  specialty_id?: string;
  title?: string;
  releaseDate?: string;
  desc?: string;
  imageName?: string;
  image?: File;
};

export type GetAllPostsData = {
  doctor_id?: string;
  specialty_id?: string;
  page?: number;
  limit?: number;
  query?: string;
  exclude?: string;
  releaseDate?: string;
};