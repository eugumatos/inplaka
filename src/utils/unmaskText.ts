export const unmaskText = (text: string) => {
  return text?.replace(/[^\d]/g, "");
};
