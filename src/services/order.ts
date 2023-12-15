import { url } from "@/constants";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";

export async function getOrders() {
  const res = await fetch(`${url}/PedidoVenda`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function geOrder(id: string) {
  const res = await fetch(`${url}/PedidoVenda/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function createOrder(order: OrderFormData) {
  const res = await fetch(`${url}/PedidoVenda`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function updateOrder(id: string, order: OrderFormData) {
  const res = await fetch(`${url}/PedidoVenda/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function destroyOrder(id: string): Promise<void> {
  const res = await fetch(`${url}/PedidoVenda/${id}`, { method: "delete" });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}
