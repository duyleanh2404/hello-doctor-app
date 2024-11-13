import {
  EditClinicData,
  CreateClinicData,
  GetAllClinicsData
} from "@/types/clinic-types";

import { handleResponse } from "@/utils/handle-response";
import { appendFormData } from "@/utils/append-form-data";

export const createClinic = async (
  accessToken: string,
  { name, address, desc, avatarName, bannerName, avatar, banner }: CreateClinicData
) => {
  const formData = new FormData();
  appendFormData(formData, { name, address, desc, avatarName, bannerName });

  if (avatar) formData.append("files", avatar);
  if (banner) formData.append("files", banner);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clinic/create`,
    {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessToken}` },
      body: formData
    }
  );

  const responseData = await response.json();
  if (!response.ok) {
    throw responseData.statusCode;
  }

  return responseData;
};

export const editClinic = async (
  accessToken: string,
  { id, name, address, desc, avatarName, bannerName, avatar, banner }: EditClinicData
) => {
  const formData = new FormData();
  appendFormData(formData, { name, address, desc, avatarName, bannerName });

  if (avatar) formData.append("files", avatar);
  if (banner) formData.append("files", banner);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clinic/${id}`,
    {
      method: "PUT",
      headers: { "Authorization": `Bearer ${accessToken}` },
      body: formData
    }
  );

  const responseData = await response.json();
  if (!response.ok) {
    throw responseData.statusCode;
  }

  return responseData;
};

export const deleteClinic = async (accessToken: string, id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clinic/${id}`,
    {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${accessToken}` }
    }
  );

  return handleResponse(response);
};

export const getAllClinics = async ({
  page = 1, limit = 10, query, exclude, province = "all"
}: GetAllClinicsData) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(query && { query }),
    ...(exclude && { exclude }),
    ...(province && { province })
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clinic?${queryParams.toString()}`,
    {
      method: "GET"
    }
  );

  return handleResponse(response);
};

export const getClinicById = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/clinic/${id}`,
    {
      method: "GET"
    }
  );

  return handleResponse(response);
};