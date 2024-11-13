import {
  EditPostData,
  CreatePostData,
  GetAllPostsData
} from "@/types/post-types";

import { handleResponse } from "@/utils/handle-response";
import { appendFormData } from "@/utils/append-form-data";

export const createPost = async (
  accessToken: string,
  { doctor_id, specialty_id, title, releaseDate, desc, imageName, image }: CreatePostData
) => {
  const formData = new FormData();
  appendFormData(formData, {
    doctor_id, specialty_id, title, releaseDate, desc, imageName
  });

  if (image) formData.append("image", image);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/post`,
    {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessToken}` },
      body: formData
    }
  );

  return handleResponse(response);
};

export const updatePost = async (
  accessToken: string,
  { id, doctor_id, specialty_id, title, releaseDate, desc, imageName, image }: EditPostData
) => {
  const formData = new FormData();
  appendFormData(formData, {
    doctor_id, specialty_id, title, releaseDate, desc, imageName
  });

  if (image) formData.append("image", image);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/post/${id}`,
    {
      method: "PUT",
      headers: { "Authorization": `Bearer ${accessToken}` },
      body: formData
    }
  );

  return handleResponse(response);
};

export const deletePost = async (accessToken: string, id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/post/${id}`,
    {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${accessToken}` }
    }
  );

  return handleResponse(response);
};

export const getAllPosts = async ({
  doctor_id, specialty_id, page = 1, limit = 10, query, exclude, releaseDate
}: GetAllPostsData) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(doctor_id && { doctor_id }),
    ...(specialty_id && { specialty_id }),
    ...(query && { query }),
    ...(exclude && { exclude }),
    ...(releaseDate && { releaseDate })
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/post?${queryParams.toString()}`,
    {
      method: "GET"
    }
  );

  return handleResponse(response);
};

export const getPostById = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/post/${id}`,
    {
      method: "GET"
    }
  );

  return handleResponse(response);
};