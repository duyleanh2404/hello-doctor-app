export const createNewSpecialty = async ({
  accessToken,
  name,
  imageName,
  image,
  desc
}: {
  accessToken: string;
  name: string;
  imageName: string;
  image?: File;
  desc: string;
}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("imageName", imageName);
  formData.append("image", image!);
  formData.append("desc", desc);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialty/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    body: formData,
  });

  return await response.json();
};

export const findAllSpecialties = async ({
  accessToken,
  page = 1,
  limit = 10,
  query = ""
}: {
  accessToken: string;
  page?: number;
  limit?: number;
  query?: string;
}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  // Append the query parameter if provided
  if (query) {
    queryParams.append("query", query); // Add query to the URL parameters
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/specialty?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  }
  );

  return await response.json();
};

export const updateSpecialty = async ({
  accessToken,
  id,
  name,
  imageName,
  image,
  desc
}: {
  accessToken: string;
  id: string;
  name?: string;
  imageName?: string;
  image?: File | null;
  desc?: string;
}) => {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (imageName) formData.append("imageName", imageName);
  if (image) formData.append("image", image);
  if (desc) formData.append("desc", desc);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialty/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    body: formData,
  });

  return await response.json();
};

export const deleteSpecialty = async ({ accessToken, id }: {
  accessToken: string;
  id: string;
}) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialty/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
  });

  return await response.json();
};

export const searchSpecialties = async ({
  accessToken,
  name,
  page = 1,
  limit = 10
}: {
  accessToken: string;
  name: string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams({
    name: name,
    page: page.toString(),
    limit: limit.toString(),
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


export const getSpecialtyById = async ({ accessToken, id }: {
  accessToken: string;
  id: string;
}) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialty/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};