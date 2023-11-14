import { url } from "@/constants";

export async function getServices() {
  const res = await fetch(`${url}/Servico`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
