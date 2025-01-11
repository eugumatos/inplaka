import { url } from "@/constants";
import { IUser } from "@/domains/user";
import { UserFormData } from "@/schemas/UserSchemaValidation";
import { getAuthToken } from "@/utils/getAuthToken";

export async function getUsers(ctx?: any): Promise<IUser[]> {
  const token = getAuthToken(ctx);

  const res = await fetch(`${url}/Users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getUser(id: string): Promise<IUser> {
  const token = getAuthToken();

  const res = await fetch(`${url}/Users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function createUser(user: UserFormData) {
  const token = getAuthToken();

  const res = await fetch(`${url}/Users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    throw new Error("Failed to create data");
  }
}

export async function destroyUser(id: string): Promise<void> {
  const token = getAuthToken();

  const res = await fetch(`${url}/Users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete data");
  }
}

export async function updateUser(user: UserFormData) {
  const token = getAuthToken();

  const res = await fetch(`${url}/Users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    throw new Error("Failed to update data");
  }
}
