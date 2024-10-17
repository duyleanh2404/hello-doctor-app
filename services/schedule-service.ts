import { CreateNewScheduleData, DeleteScheduleData, GetAllSchedulesData, GetScheduleByIdData, UpdateScheduleData } from "@/types/schedule-types";

export const createNewSchedule = async ({ accessToken, doctor_id, date, timeSlots }: CreateNewScheduleData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ doctor_id, date, timeSlots }),
  });

  return await response.json();
};

export const updateSchedule = async ({ accessToken, id, doctor_id, date, timeSlots }: UpdateScheduleData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedule/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ doctor_id, date, timeSlots }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.message || "Failed to update schedule");
  }

  return await response.json();
};

export const deleteSchedule = async ({ accessToken, id }: DeleteScheduleData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedule/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};

export const getAllSchedules = async ({
  accessToken,
  page = 1,
  limit = 10,
  query = "",
  date = ""
}: GetAllSchedulesData) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (query) {
    queryParams.append("query", query);
  }

  if (date) {
    queryParams.append("date", date);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/schedule?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred while fetching schedules.");
  }

  return await response.json();
};

export const getScheduleById = async ({ accessToken, id }: GetScheduleByIdData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/schedule/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  });

  return await response.json();
};