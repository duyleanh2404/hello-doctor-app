const validatePassword = (value: string) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/;

  const result =
    passwordRegex.test(value) ||
    "Mật khẩu phải có ít nhất một chữ hoa, một chữ thường, một số, một ký tự đặc biệt và ít nhất 8 ký tự!";

  return result;
};

export default validatePassword;