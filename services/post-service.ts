import { CreateNewPostData, DeletePostData, GetAllPostsData, GetPostByIdData, UpdatePostData } from "@/types/post-types";

export const createNewPost = async ({
  accessToken,
  title,
  desc,
  imageName,
  image,
  release_date,
  doctor_id,
  specialty_id
}: CreateNewPostData) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("desc", desc);

  if (image) {
    formData.append("image", image);
  }
  if (imageName) {
    formData.append("imageName", imageName);
  }
  if (release_date) {
    formData.append("release_date", release_date);
  }
  if (doctor_id) {
    formData.append("doctor_id", doctor_id);
  }
  if (specialty_id) {
    formData.append("specialty_id", specialty_id);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred while create new post!");
  }

  return await response.json();
};

export const updatePost = async ({
  accessToken,
  id,
  title,
  imageName,
  image,
  desc,
  specialty_id,
  doctor_id,
  release_date,
}: UpdatePostData) => {
  const formData = new FormData();

  if (title) formData.append("title", title);
  if (desc) formData.append("desc", desc);
  if (image) formData.append("image", image);
  if (imageName) formData.append("imageName", imageName);
  if (specialty_id) formData.append("specialty_id", specialty_id);
  if (doctor_id) formData.append("doctor_id", doctor_id);
  if (release_date) formData.append("release_date", release_date);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred while updating the post!");
  }

  return await response.json();
};

export const deletePost = async ({ accessToken, id }: DeletePostData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};

export const getAllPosts = async ({
  accessToken,
  page = 1,
  limit = 10,
  query = "",
  specialty,
  doctor,
  release_date
}: GetAllPostsData) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (query) {
    queryParams.append("query", query);
  }

  if (specialty) {
    queryParams.append("specialty", specialty);
  }

  if (doctor) {
    queryParams.append("doctor", doctor);
  }

  if (release_date) {
    queryParams.append("release_date", release_date);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/post?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred while fetching posts.");
  }

  return await response.json();
};

export const getPostById = async ({ accessToken, id }: GetPostByIdData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};