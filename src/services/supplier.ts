import { url } from "@/constants";
import { SupplierFormData } from "@/schemas/SupplierSchemaValidation";
import { ISupplier } from "@/domains/supplier";

export async function getSuppliers(): Promise<ISupplier[]> {
  const res = await fetch(`${url}/Fornecedor`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getSupplier(id: string): Promise<ISupplier> {
  const res = await fetch(`${url}/Fornecedor/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function destroySupplier(id: string): Promise<void> {
  const res = await fetch(`${url}/Fornecedor/${id}`, { method: "delete" });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function createSupplier(seller: SupplierFormData) {
  const res = await fetch(`${url}/Fornecedor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(seller),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function updateSupplier(id: string, seller: SupplierFormData) {
  const res = await fetch(`${url}/Fornecedor/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(seller),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}
