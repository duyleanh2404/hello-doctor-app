export type ActiveTime = "morning" | "afternoon" | "evening";

export const timeRanges: Record<ActiveTime, { start: string; end: string }> = {
  morning: { start: "06:00", end: "12:00" },
  afternoon: { start: "12:00", end: "18:00" },
  evening: { start: "18:00", end: "23:59" }
};