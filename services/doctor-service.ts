import {
  EditDoctorData,
  CreateDoctorData,
  GetAllDoctorsData
} from "@/types/doctor-types";

import { handleResponse } from "@/utils/handle-response";
import { appendFormData } from "@/utils/append-form-data";

export const createDoctor = async (
  accessToken: string,
  { clinic_id, specialty_id, fullname, province, medicalFee, desc, imageName, image }: CreateDoctorData
) => {
  const formData = new FormData();
  appendFormData(formData, {
    clinic_id, specialty_id, fullname, province, medicalFee: String(medicalFee), desc, imageName
  });

  if (image) formData.append("image", image);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/doctor/create`,
    {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessToken}` },
      body: formData
    }
  );

  return handleResponse(response);
};

export const editDoctor = async (
  accessToken: string,
  { id, clinic_id, specialty_id, fullname, province, medicalFee, desc, imageName, image }: EditDoctorData
) => {
  const formData = new FormData();
  appendFormData(formData, {
    clinic_id, specialty_id, fullname, province, medicalFee: medicalFee?.toString(), desc, imageName
  });

  if (image) formData.append("image", image);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/doctor/${id}`,
    {
      method: "PUT",
      headers: { "Authorization": `Bearer ${accessToken}` },
      body: formData
    }
  );

  return handleResponse(response);
};

export const deleteDoctor = async (accessToken: string, id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/doctor/${id}`,
    {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${accessToken}` }
    }
  );

  return handleResponse(response);
};

export const getAllDoctors = async ({
  page = 1, limit = 10, clinic_id, specialty_id, query, exclude, province = "all"
}: GetAllDoctorsData) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(clinic_id && { clinic_id }),
    ...(specialty_id && { specialty_id }),
    ...(query && { query }),
    ...(exclude && { exclude }),
    ...(province && { province })
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/doctor?${queryParams.toString()}`,
    {
      method: "GET"
    }
  );

  return handleResponse(response);
};

export const getDoctorById = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/doctor/${id}`,
    {
      method: "GET"
    }
  );

  return handleResponse(response);
};