import { url } from "@/constants";
import { ClientFormData } from "@/schemas/ClientSchemaValidation";
import { IClient } from "@/domains/client";

export async function getClients(): Promise<IClient[]> {
  const res = await fetch(`${url}/Cliente`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getClient(id: string): Promise<IClient> {
  const res = await fetch(`${url}/Cliente/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function destroyClient(id: string): Promise<void> {
  const res = await fetch(`${url}/Cliente/${id}`, { method: "delete" });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function createClient(client: ClientFormData) {
  const res = await fetch(`${url}/Cliente`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function updateClient(company: ClientFormData) {
  const res = await fetch(`${url}/Cliente`, {
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
