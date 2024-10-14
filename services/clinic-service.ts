import {
  UpdateClinicData,
  CreateClinicData,
  DeleteClinicData,
  GetAllClinicsData,
  GetClinicByIdData
} from "@/types/clinic-types";

export const createNewClinic = async ({
  name,
  avatar,
  banner,
  desc,
  address,
  avatarName,
  bannerName,
  accessToken
}: CreateClinicData) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("desc", desc);
  formData.append("address", address);
  formData.append("avatarName", avatarName);
  formData.append("bannerName", bannerName);

  if (avatar) formData.append("files", avatar);
  if (banner) formData.append("files", banner);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clinic/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    body: formData
  });

  return response.json();
};

export const updateClinic = async ({
  id,
  name,
  desc,
  avatar,
  banner,
  address,
  avatarName,
  bannerName,
  accessToken
}: UpdateClinicData) => {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (desc) formData.append("desc", desc);
  if (avatar) formData.append("avatar", avatar);
  if (banner) formData.append("banner", banner);
  if (address) formData.append("address", address);
  if (avatarName) formData.append("avatarName", avatarName);
  if (bannerName) formData.append("bannerName", bannerName);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clinic/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    body: formData
  });

  return await response.json();
};

export const deleteClinic = async ({ accessToken, id }: DeleteClinicData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clinic/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};

export const getAllClinics = async ({
  accessToken,
  page = 1,
  limit = 10,
  query = "",
  province = ""
}: GetAllClinicsData) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  if (query) {
    queryParams.append("query", query);
  }

  if (province) {
    queryParams.append("province", province);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clinic?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};

export const getClinicById = async ({ accessToken, id }: GetClinicByIdData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clinic/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};