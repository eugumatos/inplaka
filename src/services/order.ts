import { url } from "@/constants";

export async function getOrders() {
  const res = await fetch(`${url}/PedidoVenda`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
