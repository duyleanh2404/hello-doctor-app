import { toDate } from "date-fns-tz";

import {
  GetScheduleData,
  EditScheduleData,
  CreateScheduleData,
  GetAllSchedulesData,
  GetSchedulesByRange
} from "@/types/schedule-types";

import { handleResponse } from "@/utils/handle-response";
import { formatDateInTimeZone } from "@/utils/format-date-in-timezone";

export const createSchedule = async (accessToken: string, data: CreateScheduleData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schedule`,
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

  const responseData = await response.json();
  if (!response.ok) {
    throw responseData.statusCode;
  }

  return responseData;
};

export const editSchedule = async (accessToken: string, data: EditScheduleData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schedule/${data.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    }
  );

  return handleResponse(response);
};

export const deleteSchedule = async (accessToken: string, id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schedule/${id}`,
    {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${accessToken}` }
    }
  );

  return handleResponse(response);
};

export const getAllSchedules = async (
  accessToken: string,
  { page = 1, limit = 10, query, exclude, date }: GetAllSchedulesData
) => {
  const dateISOString = date?.toISOString();

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(query && { query }),
    ...(exclude && { exclude }),
    ...(date && { date: dateISOString })
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schedule/all?${queryParams.toString()}`,
    {
      method: "GET",
      headers: { "Authorization": `Bearer ${accessToken}` }
    }
  );

  return handleResponse(response);
};

export const getSchedulesByRange = async ({ doctor_id, startDate, endDate }: GetSchedulesByRange) => {
  if (startDate && endDate) {
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);
  }

  const queryParams = new URLSearchParams({
    ...(doctor_id && { doctor_id }),
    ...(startDate && { startDate: startDate.toISOString() }),
    ...(endDate && { endDate: endDate.toISOString() })
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schedule/range?${queryParams.toString()}`,
    {
      method: "GET"
    }
  );

  return handleResponse(response);
};

export const getSchedule = async ({ doctor_id, schedule_id, date }: GetScheduleData) => {
  let utcDate;
  if (date) {
    const localDate = toDate(date, { timeZone: "Asia/Ho_Chi_Minh" });
    utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
  }

  const queryParams = new URLSearchParams({
    ...(doctor_id && { doctor_id }),
    ...(schedule_id && { schedule_id }),
    ...(date && { date: utcDate })
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schedule?${queryParams.toString()}`,
    {
      method: "GET"
    }
  );

  return handleResponse(response);
};