export type UserData = {
  _id: string;
  email: string;
  fullname: string;
  role: string;
  gender?: string;
  address?: string;
  password?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  image?: string;
  otp?: string;
};

export type EditUserForm = {
  _id: string;
  fullname: string;
  desc: string;
  gender: string;
  address: string;
  dateOfBirth: string;
  phoneNumber: string;
  day: string;
  month: string;
  year: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  image?: FileList;
};

export type EditUserData = {
  id: string;
  fullname?: string;
  gender?: string;
  address?: string;
  province?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  imageName?: string;
  image?: File;
};

export type GetAllUsersData = {
  page?: number;
  limit?: number;
  query?: string;
  province?: string;
};