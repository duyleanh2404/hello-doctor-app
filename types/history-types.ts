export interface CreateHistoryForm {
  doctorComment: string;
  healthStatus: "bad" | "normal" | "good";
  prescriptionImage: FileList;
};

export interface CreateHistoryData {
  email: string;
  appointment_id: string;
  doctorComment: string;
  healthStatus: "bad" | "normal" | "good";
  prescriptionImage: File;
};