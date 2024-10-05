interface Response {
  success: boolean;
  provinces?: any[];
};

export const useProvinces = async (): Promise<Response> => {
  const response = await fetch("https://provinces.open-api.vn/api/p");
  if (!response.ok) {
    return { success: false };
  }

  const provinces = await response.json();

  return {
    success: true,
    provinces
  };
};