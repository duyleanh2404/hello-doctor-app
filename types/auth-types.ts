export type LoginForm = {
  email: string;
  password: string;
};

export type RegisterForm = {
  email: string;
  fullname: string;
  day: string;
  month: string;
  year: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  gender: string;
  password: string;
  phoneNumber: string;
};

export type ResetPasswordForm = {
  newPassword: string;
  confirmNewPassword: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  fullname: string;
  gender: string;
  address: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
};

export type VerifyOtpData = {
  email: string;
  otp: string;
};

export type ContinueWithGoogleData = {
  email: string;
  name: string;
  image: string;
};

export type ResetPasswordData = {
  email: string;
  newPassword: string;
};