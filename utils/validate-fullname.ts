export const validateFullName = (value: string) => {
  if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
    return "Tên không được chứa số hoặc ký tự đặc biệt!";
  }
  return true;
};