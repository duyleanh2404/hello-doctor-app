import {
  DeleteDoctorData,
  UpdateDoctorData,
  GetDoctorByIdData,
  GetAllDoctorsData,
  CreateNewDoctorData,
} from "@/types/doctor-types";

export const createNewDoctor = async ({
  desc,
  image,
  fullname,
  province,
  clinic_id,
  imageName,
  medical_fee,
  accessToken,
  specialty_id
}: CreateNewDoctorData) => {
  const formData = new FormData();

  formData.append("desc", desc);
  formData.append("image", image!);
  formData.append("clinic_id", clinic_id);
  formData.append("fullname", fullname);
  formData.append("province", province);
  formData.append("imageName", imageName);
  formData.append("medical_fee", String(medical_fee));
  formData.append("specialty_id", specialty_id);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctor/create`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || "Error creating new doctor!");
  }

  return await response.json();
};

export const updateDoctor = async ({
  id,
  desc,
  image,
  fullname,
  province,
  imageName,
  clinic_id,
  accessToken,
  medical_fee,
  specialty_id
}: UpdateDoctorData) => {
  const formData = new FormData();

  if (desc) formData.append("desc", desc);
  if (image) formData.append("image", image);
  if (fullname) formData.append("fullname", fullname);
  if (province) formData.append("province", province);
  if (imageName) formData.append("imageName", imageName);
  if (clinic_id) formData.append("clinic_id", clinic_id);
  if (specialty_id) formData.append("specialty_id", specialty_id);
  if (medical_fee !== undefined) formData.append("medical_fee", medical_fee.toString());

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctor/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error("Failed to update doctor");
  }

  return await response.json();
};

export const deleteDoctor = async ({ accessToken, id }: DeleteDoctorData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctor/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};

export const getAllDoctors = async ({
  accessToken,
  page = 1,
  limit = 10,
  query = "",
  clinic = "",
  province = "",
  specialty = ""
}: GetAllDoctorsData) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });

  if (query) {
    queryParams.append("query", query);
  }

  if (clinic) {
    queryParams.append("clinic", clinic);
  }

  if (province) {
    queryParams.append("province", province);
  }

  if (specialty) {
    queryParams.append("specialty", specialty);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/doctor?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};

export const getDoctorById = async ({ accessToken, id }: GetDoctorByIdData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctor/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};