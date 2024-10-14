export interface RegisterFormInputs {
  day: string;
  year: string;
  email: string;
  month: string;
  gender: string;
  street: string;
  district: string;
  province: string;
  fullname: string;
  password: string;
  phoneNumber: string;
};

export interface LoginUserData {
  email: string;
  password: string;
};

export interface RegisterUserData {
  email: string;
  gender: string;
  address: string;
  fullname: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
};

export interface LoginOrRegisterWithGoogleData {
  name: string;
  email: string;
};

export interface VerifyOtpData {
  otp: string;
  email: string;
};

export interface ResetPasswordData {
  email: string;
  newPassword: string;
};