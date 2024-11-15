import { handleResponse } from "@/utils/handle-response";
import { formatDateInTimeZone } from "@/utils/format-date-in-timezone";

import { CreateAppointmentData, GetAllAppointmentsData } from "@/types/appointment-types";

export const createAppointment = async (accessToken: string, appointmentData: CreateAppointmentData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointment/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      ...appointmentData,
      date: formatDateInTimeZone(appointmentData.date, "Asia/Ho_Chi_Minh")
    })
  });

  return handleResponse(response);
};

export const verifyAppointment = async (accessToken: string, token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointment/${token}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${accessToken}` }
  });

  return handleResponse(response);
};

export const deleteAppointment = async (accessToken: string, id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointment/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${accessToken}` }
  });

  return handleResponse(response);
};

export const getAllAppointments = async (
  accessToken: string,
  { page = 1, limit = 10, query, user_id, doctor_id, date }: GetAllAppointmentsData
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(user_id && { user_id }),
    ...(doctor_id && { doctor_id }),
    ...(query && { query }),
    ...(date && { date: formatDateInTimeZone(date, "Asia/Ho_Chi_Minh") })
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointment/all?${queryParams.toString()}`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${accessToken}` }
    }
  );

  return handleResponse(response);
};