export const login = async ({ email, password }: { email: string; password: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return await response.json();
};

export const register = async (userData: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  return await response.json();
};

export const loginOrRegisterWithGoogle = async (userData: { email: string; name: string; }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login-or-register-with-google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  return await response.json();
};

export const verifyOtp = async ({ email, otp }: { email: string; otp: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, otp })
  });

  return await response.json();
};

export const resendOtp = async ({ email }: { email: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  return await response.json();
};

export const resetPassword = async ({ email, newPassword }: { email: string; newPassword: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, newPassword })
  });

  return await response.json();
};