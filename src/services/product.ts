import { url } from "@/constants";
import { ProductFormData } from "@/schemas/ProductSchemaValidation";
import { IProduct } from "@/domains/product";

export async function getProducts(): Promise<IProduct[]> {
  const res = await fetch(`${url}/Produto`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getProduct(id: string): Promise<IProduct> {
  const res = await fetch(`${url}/Produto/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function destroyProduct(id: string): Promise<void> {
  const res = await fetch(`${url}/Produto/${id}`, { method: "delete" });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function createProduct(product: ProductFormData) {
  const res = await fetch(`${url}/Produto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function updateProduct(id: string, product: ProductFormData) {
  const res = await fetch(`${url}/Produto/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}
