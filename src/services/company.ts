import { url } from "@/constants";
import { ICompany } from "@/domains/company";
import { CompanyFormData } from "@/schemas/CompanySchemaValidation";

export async function getCompany(id: string): Promise<ICompany> {
  const res = await fetch(`${url}/Empresa/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getCompanies(): Promise<ICompany[]> {
  const res = await fetch(`${url}/Empresa`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function destroyCompany(id: string): Promise<void> {
  const res = await fetch(`${url}/Empresa/${id}`, { method: "delete" });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function createCompany(company: CompanyFormData) {
  const res = await fetch(`${url}/Empresa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(company),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function updateCompany(company: CompanyFormData) {
  const res = await fetch(`${url}/Empresa/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(company),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}
