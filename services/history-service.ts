import { CreateHistoryData } from "@/types/history-types";

import { handleResponse } from "@/utils/handle-response";
import { appendFormData } from "@/utils/append-form-data";

export const createHistory = async (
  accessToken: string,
  { appointment_id, email, doctorComment, healthStatus, prescriptionImage }: CreateHistoryData
) => {
  const formData = new FormData();
  appendFormData(formData, { appointment_id, email, doctorComment, healthStatus });

  if (prescriptionImage) formData.append("prescriptionImage", prescriptionImage);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/history`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${accessToken}` },
    body: formData
  });

  return handleResponse(response);
};