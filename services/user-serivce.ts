import { EditUserData, GetAllUsersData } from "@/types/user-types";

import { appendFormData } from "@/utils/append-form-data";
import { handleResponse } from "@/utils/handle-response";

export const editUser = async (
  accessToken: string,
  { id, fullname, gender, address, province, dateOfBirth, phoneNumber, imageName, image }: EditUserData
) => {
  const formData = new FormData();
  appendFormData(formData, { fullname, gender, address, province, dateOfBirth, phoneNumber, imageName });

  if (image) formData.append("image", image);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${accessToken}` },
    body: formData
  });

  return handleResponse(response);
};

export const deleteUser = async (accessToken: string, id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${accessToken}` }
  });

  return handleResponse(response);
};

export const getAllUsers = async (
  accessToken: string, { page = 1, limit = 10, query, province = "all" }: GetAllUsersData
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(query && { query }),
    ...(province && { province })
  });

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user?${queryParams.toString()}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${accessToken}` }
  });

  return handleResponse(response);
};

export const getCurrentUser = async (accessToken: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${accessToken}` }
  });

  return handleResponse(response);
};

export const getUserById = async (accessToken: string, id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${accessToken}` }
  });

  return handleResponse(response);
};