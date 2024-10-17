import { DoctorData } from "./doctor-types";
import { SpecialtyData } from "./specialty-types";

export interface CreateNewPostData {
  accessToken: string;
  title: string;
  desc: string;
  imageName?: string;
  image?: File;
  release_date?: string;
  doctor_id?: string;
  specialty_id?: string;
};

export interface PostData {
  _id: string;
  accessToken: string;
  title: string;
  desc: string;
  imageName: string;
  image: FileList | null;
  release_date: string;
  doctor: string;
  specialty: string;
  doctor_id: DoctorData;
  specialty_id: SpecialtyData;
};

export interface GetAllPostsData {
  accessToken: string;
  page?: number;
  limit?: number;
  query?: string;
  specialty?: string;
  doctor?: string;
  release_date?: string;
};

export interface DeletePostData {
  id: string;
  accessToken: string;
};

export interface GetPostByIdData {
  id: string;
  accessToken: string;
};

export interface UpdatePostData {
  accessToken: string;
  id: string;
  title?: string;
  imageName?: string;
  image?: File;
  desc?: string;
  specialty_id?: string;
  doctor_id?: string;
  release_date?: string;
};