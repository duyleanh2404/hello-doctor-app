import { toDate } from "date-fns-tz";

import { handleResponse } from "@/utils/handle-response";
import { formatDateInTimeZone } from "@/utils/format-date-in-timezone";

import { CreateAppointmentData, GetAllAppointmentsData } from "@/types/appointment-types";

export const createAppointment = async (accessToken: string, data: CreateAppointmentData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointment/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        ...data,
        date: formatDateInTimeZone(data.date, "Asia/Ho_Chi_Minh")
      })
    }
  );

  return handleResponse(response);
};

export const verifyAppointment = async (accessToken: string, token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointment/${token}`,
    {
      method: "PUT",
      headers: { "Authorization": `Bearer ${accessToken}` }
    }
  );

  return handleResponse(response);
};

export const deleteAppointment = async (accessToken: string, id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointment/${id}`,
    {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${accessToken}` }
    }
  );

  return handleResponse(response);
};

export const getAllAppointments = async (
  accessToken: string,
  { page = 1, limit = 10, user_id, doctor_id, query, date }: GetAllAppointmentsData
) => {
  let utcDate;
  if (date) {
    const localDate = toDate(date, { timeZone: "Asia/Ho_Chi_Minh" });
    utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
  }

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(user_id && { user_id }),
    ...(doctor_id && { doctor_id }),
    ...(query && { query }),
    ...(date && { date: utcDate })
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