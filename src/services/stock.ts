import { url } from "@/constants";
import { IStock } from "@/domains/stock";
import { StockFormData } from "@/schemas/StockSchemaValidation";

export async function getStock(): Promise<IStock[]> {
  const res = await fetch(`${url}/Estoque`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function updateStock(stock: StockFormData) {
  const res = await fetch(`${url}/Estoque`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stock),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}
