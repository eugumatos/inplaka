import { url } from "@/constants";
import { AccountFormData } from "@/schemas/AccountSchemaValidation";

export async function getAccounts() {
  const res = await fetch(`${url}/Conta`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function createAccount(service: AccountFormData) {
  await fetch(`${url}/Conta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(service),
  });
}

export async function destroyAccount(id: string): Promise<void> {
  const res = await fetch(`${url}/Conta/${id}`, { method: "delete" });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function updateAccount(id: string, service: AccountFormData) {
  const res = await fetch(`${url}/Conta/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(service),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}
