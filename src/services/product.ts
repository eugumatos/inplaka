import { url } from "@/constants";

export async function getProducts() {
  const res = await fetch(`${url}/Produto`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
