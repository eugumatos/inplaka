import { url } from "@/constants";
import { UserFormData } from "@/schemas/UserSchemaValidation";
import { IUser } from "@/domains/user";

export async function getUsers(): Promise<IUser[]> {
  const res = await fetch(`${url}/Users`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getUser(id: string): Promise<IUser> {
  const res = await fetch(`${url}/Users/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function createUser(user: UserFormData) {
  await fetch(`${url}/Users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}

export async function destroyUser(id: string): Promise<void> {
  const res = await fetch(`${url}/Users/${id}`, { method: "delete" });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function updateUser(user: UserFormData) {
  const res = await fetch(`${url}/Users`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}
