import { url } from "@/constants";
import { SellerFormData } from "@/schemas/SellerSchemaValidation";
import { ISeller } from "@/domains/seller";

export async function getSellers(): Promise<ISeller[]> {
  const res = await fetch(`${url}/Vendedor`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getSeller(id: string): Promise<ISeller> {
  const res = await fetch(`${url}/Vendedor/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function destroySeller(id: string): Promise<void> {
  const res = await fetch(`${url}/Vendedor/${id}`, { method: "delete" });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function createSeller(seller: SellerFormData) {
  const res = await fetch(`${url}/Vendedor`, {
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

export async function updateSeller(seller: SellerFormData) {
  const res = await fetch(`${url}/Vendedor`, {
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
