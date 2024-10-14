import {
  UpdateSpecialtyData,
  CreateSpecialtyData,
  DeleteSpecialtyData,
  GetSpecialtyByIdData,
  GetAllSpecialtiesData,
  SearchSpecialtiesData
} from "@/types/specialty-types";

export const createNewSpecialty = async ({
  accessToken, name, imageName, image, desc
}: CreateSpecialtyData) => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("desc", desc);
  formData.append("image", image!);
  formData.append("imageName", imageName);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialty/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    body: formData
  });

  return await response.json();
};

export const getAllSpecialties = async ({
  accessToken, page = 1, limit = 10, query = ""
}: GetAllSpecialtiesData) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  if (query) {
    queryParams.append("query", query);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/specialty?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};

export const updateSpecialty = async ({
  accessToken, id, name, imageName, image, desc
}: UpdateSpecialtyData) => {
  const formData = new FormData();

  if (name) formData.append("name", name);
  if (desc) formData.append("desc", desc);
  if (image) formData.append("image", image);
  if (imageName) formData.append("imageName", imageName);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialty/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    body: formData
  });

  return await response.json();
};

export const deleteSpecialty = async ({ accessToken, id }: DeleteSpecialtyData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialty/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};

export const searchSpecialties = async ({
  accessToken, name, page = 1, limit = 10
}: SearchSpecialtiesData) => {
  const queryParams = new URLSearchParams({
    name: name,
    page: page.toString(),
    limit: limit.toString()
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/specialty/search?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};

export const getSpecialtyById = async ({ accessToken, id }: GetSpecialtyByIdData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialty/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};