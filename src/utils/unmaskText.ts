export const unmaskText = (text: any): string => {
  return String(text || "").replace(/[^\d]/g, "");
};
