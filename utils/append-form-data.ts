export const appendFormData = (formData: FormData, fields: Record<string, any>) => {
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
};