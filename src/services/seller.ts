import { url } from "@/constants";
import { ISeller } from "@/domains/seller";

export async function getSellers(): Promise<ISeller[]> {
  const res = await fetch(`${url}/Vendedor`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
