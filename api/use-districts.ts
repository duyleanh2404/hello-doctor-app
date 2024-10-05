interface Response {
  success: boolean;
  districts?: any[];
};

export const useDistricts = async (province: string): Promise<Response> => {
  const response = await fetch(`https://provinces.open-api.vn/api/d/search/?q=${province}`);
  if (!response.ok) {
    return { success: false };
  }

  const districts = await response.json();

  return {
    success: true,
    districts
  };
};