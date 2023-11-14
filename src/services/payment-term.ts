import { url } from "@/constants";

export async function getPaymentTerms() {
  const res = await fetch(`${url}/CondicaoPagamento`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
