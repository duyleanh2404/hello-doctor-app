export const formatVietnameseCurrency = (amount: number): string => {
  if (!isFinite(amount)) return "0 VNĐ";
  const formattedAmount = amount
    .toLocaleString("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  return `${formattedAmount} VNĐ`;
};