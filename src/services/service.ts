import { url } from "@/constants";
import { ServiceFormData } from "@/schemas/ServiceSchemaValidation";
import { IService } from "@/domains/service";

export async function getServices(): Promise<IService[]> {
  const res = await fetch(`${url}/Servico`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getService(id: string): Promise<IService> {
  const res = await fetch(`${url}/Servico/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function createService(service: ServiceFormData) {
  await fetch(`${url}/Servico`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(service),
  });
}

export async function destroyService(id: string): Promise<void> {
  const res = await fetch(`${url}/Servico/${id}`, { method: "delete" });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function updateService(service: ServiceFormData) {
  const res = await fetch(`${url}/Servico`, {
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
