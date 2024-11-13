import {
  EditSpecialtyData,
  CreateSpecialtyData,
  GetAllSpecialtiesData
} from "@/types/specialty-types";

import { handleResponse } from "@/utils/handle-response";
import { appendFormData } from "@/utils/append-form-data";

export const createSpecialty = async (
  accessToken: string,
  { name, desc, imageName, image }: CreateSpecialtyData
) => {
  const formData = new FormData();
  appendFormData(formData, { name, desc, imageName });

  if (image) formData.append("image", image);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/specialty/create`,
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

export const editSpecialty = async (
  accessToken: string,
  { id, name, desc, imageName, image }: EditSpecialtyData
) => {
  const formData = new FormData();
  appendFormData(formData, { name, desc, imageName });

  if (image) formData.append("image", image);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/specialty/${id}`,
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

export const deleteSpecialty = async (accessToken: string, id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/specialty/${id}`,
    {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${accessToken}` }
    }
  );

  return await handleResponse(response);
};

export const getAllSpecialties = async ({
  page = 1, limit = 10, query, exclude
}: GetAllSpecialtiesData) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(query && { query }),
    ...(exclude && { exclude })
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/specialty?${queryParams.toString()}`,
    {
      method: "GET"
    }
  );

  return await handleResponse(response);
};

export const getSpecialtyById = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/specialty/${id}`,
    {
      method: "GET"
    }
  );

  return await handleResponse(response);
};

export const getSpecialtyByName = async (name: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/specialty/name/${name}`,
    {
      method: "GET"
    }
  );

  return await handleResponse(response);
};