import { url } from "@/constants";
import { IClient } from "@/domains/client";

export async function getClients(): Promise<IClient[]> {
  const res = await fetch(`${url}/Cliente`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
