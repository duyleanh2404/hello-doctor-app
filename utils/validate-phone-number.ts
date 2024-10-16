export const validatePhoneNumber = (value: string) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(value) || "Vui lòng nhập số điện thoại hợp lệ!";
};