import { url } from "@/constants";
import { ICompany } from "@/domains/company";
import { CompanyFormData } from "@/schemas/CompanySchemaValidation";

export async function filterByDate(id: string): Promise<ICompany> {
  const res = await fetch(`${url}/Empresa/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function filterByDateClient(
  client: string,
  startDate: Date | null,
  endDate: Date | null
): Promise<[]> {
  const res = await fetch(
    `${url}/PedidoVenda/${client}/${startDate}/${endDate}`
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
