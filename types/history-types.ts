export interface CreateHistoryForm {
  doctorComment: string;
  healthStatus: "bad" | "normal" | "good";
  prescriptionImage: FileList;
};

export interface CreateHistoryData {
  appointment_id: string;
  email: string;
  doctorComment: string;
  healthStatus: "bad" | "normal" | "good";
  prescriptionImage: File;
};