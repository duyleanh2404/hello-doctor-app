export interface UserData {
  _id: string;
  role: string;
  otp?: string;
  email: string;
  image?: string;
  gender?: string;
  address?: string;
  fullname: string;
  password?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
};

export interface GetAllUsersData {
  page?: number;
  limit?: number;
  query?: string;
  province?: string;
  accessToken: string;
};

export interface GetUserByIdData {
  id: string;
  accessToken: string;
};

export interface UpdateUserData {
  id: string;
  gender?: string;
  address?: string;
  fullname?: string;
  imageName?: string;
  dateOfBirth?: string;
  accessToken: string;
  image?: File | null;
  phoneNumber?: string;
};

export interface DeleteUserData {
  id: string;
  accessToken: string;
};