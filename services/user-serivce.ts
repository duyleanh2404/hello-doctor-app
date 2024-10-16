import {
  UpdateUserData,
  DeleteUserData,
  GetAllUsersData,
  GetUserByIdData
} from "@/types/user-types";

export const updateUser = async ({
  id,
  image,
  gender,
  address,
  fullname,
  imageName,
  accessToken,
  dateOfBirth,
  phoneNumber
}: UpdateUserData) => {
  const formData = new FormData();

  if (fullname) formData.append("fullname", fullname);
  if (imageName) formData.append("imageName", imageName);
  if (image) formData.append("image", image);
  if (gender) formData.append("gender", gender);
  if (phoneNumber) formData.append("phoneNumber", phoneNumber);
  if (address) formData.append("address", address);
  if (dateOfBirth) formData.append("dateOfBirth", dateOfBirth);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred while update user!");
  }

  return await response.json();
};

export const deleteUser = async ({ accessToken, id }: DeleteUserData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};

export const getCurrentUser = async (accessToken: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred while fetching current user!");
  }

  return await response.json();
};

export const getAllUsers = async ({
  accessToken, page = 1, limit = 10, province = "", query = ""
}: GetAllUsersData) => {
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
    `${process.env.NEXT_PUBLIC_API_URL}/user?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};

export const getUserById = async ({ accessToken, id }: GetUserByIdData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};