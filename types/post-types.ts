import { DoctorData } from "./doctor-types";
import { SpecialtyData } from "./specialty-types";

export interface PostData {
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

export interface CreatePostForm {
  doctor_id: string;
  specialty_id: string;
  title: string;
  releaseDate: string;
  desc: string;
  imageName: string;
  image: FileList;
};

export interface EditPostForm {
  doctor_id?: string;
  specialty_id?: string;
  title?: string;
  releaseDate?: string;
  desc?: string;
  imageName?: string;
  image?: FileList;
};

export interface CreatePostData {
  doctor_id: string;
  specialty_id: string;
  title: string;
  releaseDate: string;
  desc: string;
  imageName: string;
  image: File;
};


export interface EditPostData {
  id: string;
  doctor_id?: string;
  specialty_id?: string;
  title?: string;
  releaseDate?: string;
  desc?: string;
  imageName?: string;
  image?: File;
};

export interface GetAllPostsData {
  doctor_id?: string;
  specialty_id?: string;
  page?: number;
  limit?: number;
  query?: string;
  exclude?: string;
  releaseDate?: string;
};