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

export async function getRolePermissionsById(id: string): Promise<any> {
  const res = await fetch(`${url}/RotaRole/getByIdRole/${id}`);

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

export async function destroyRelation(
  idRole: string,
  idRota: string
): Promise<void> {
  const res = await fetch(`${url}/RotaRole/${idRole}/${idRota}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete data");
  }
}

export async function updatePermissions(permission: any): Promise<any> {
  const res = await fetch(`${url}/RotaRole`, {
    method: "POST",
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
