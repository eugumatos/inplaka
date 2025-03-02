import { url } from "@/constants";
import { IRole } from "@/domains/role";

export async function getAllRoles(): Promise<IRole[]> {
  const res = await fetch(`${url}/Role`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
