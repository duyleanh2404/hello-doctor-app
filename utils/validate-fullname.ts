const validateFullName = (value: string) => {
  const words = value.trim().split(" ");

  if (words.some((word) => word.length < 2)) {
    return "Mỗi từ phải có ít nhất 2 ký tự!";
  }

  if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
    return "Tên không được chứa số hoặc ký tự đặc biệt!";
  }

  return true;
};

export default validateFullName;