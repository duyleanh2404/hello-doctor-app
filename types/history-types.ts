export type CreateHistoryForm = {
  doctorComment: string;
  healthStatus: "bad" | "normal" | "good";
  prescriptionImage: FileList;
};

export type CreateHistoryData = {
  appointment_id: string;
  email: string;
  doctorComment: string;
  healthStatus: "bad" | "normal" | "good";
  prescriptionImage: File;
};