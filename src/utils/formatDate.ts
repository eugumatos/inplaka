import { parseISO, format } from "date-fns";

export const formatDate = (date: string) => {
  const newDate = parseISO(date);

  return format(newDate, "dd/MM/yyyy");
};
