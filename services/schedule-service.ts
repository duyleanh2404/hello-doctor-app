import {
  GetScheduleData,
  EditScheduleData,
  CreateScheduleData,
  GetAllSchedulesData,
  GetSchedulesByRangeData
} from "@/types/schedule-types";

import { handleResponse } from "@/utils/handle-response";
import { formatDateInTimeZone } from "@/utils/format-date-in-timezone";

export const createSchedule = async (accessToken: string, scheduleData: CreateScheduleData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      ...scheduleData,
      date: formatDateInTimeZone(scheduleData.date, "Asia/Ho_Chi_Minh")
    })
  }
  );

  const responseData = await response.json();
  if (!response.ok) {
    throw responseData.statusCode;
  }

  return responseData;
};

export const editSchedule = async (accessToken: string, scheduleData: EditScheduleData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schedule/${scheduleData.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(scheduleData)
  });

  return handleResponse(response);
};

export const deleteSchedule = async (accessToken: string, id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedule/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${accessToken}` }
  });

  return handleResponse(response);
};

export const getAllSchedules = async (
  accessToken: string, { page = 1, limit = 10, query, exclude, date }: GetAllSchedulesData
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(query && { query }),
    ...(exclude && { exclude }),
    ...(date && { date: formatDateInTimeZone(date, "Asia/Ho_Chi_Minh") })
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schedule/all?${queryParams.toString()}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${accessToken}` }
  });

  return handleResponse(response);
};

export const getSchedulesByRange = async ({ doctor_id, startDate, endDate }: GetSchedulesByRangeData) => {
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
  const queryParams = new URLSearchParams({
    ...(doctor_id && { doctor_id }),
    ...(schedule_id && { schedule_id }),
    ...(date && { date: formatDateInTimeZone(date, "Asia/Ho_Chi_Minh") })
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schedule?${queryParams.toString()}`,
    {
      method: "GET"
    }
  );

  return handleResponse(response);
};