export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 7; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeSlot = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      slots.push(timeSlot);
    }
  }
  return slots;
};