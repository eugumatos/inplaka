import { url } from "@/constants";

export async function getAllPermissions(): Promise<any> {
  const res = await fetch(`${url}/Role`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getPermissionsById(id: string): Promise<any> {
  const res = await fetch(`${url}/Role/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getAllRoutes(): Promise<any> {
  const res = await fetch(`${url}/Rota`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function updatePermissions(permission: any): Promise<any> {
  const res = await fetch(`${url}/RotaRole`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(permission),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
