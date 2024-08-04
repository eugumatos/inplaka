import { url } from "@/constants";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { IOrder } from "@/domains/order";

export async function getOrders(): Promise<IOrder[]> {
  const res = await fetch(`${url}/PedidoVenda`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getOrder(id: string): Promise<IOrder> {
  const res = await fetch(`${url}/PedidoVenda/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getOrderByClient(id: string): Promise<IOrder[]> {
  const res = await fetch(`${url}/PedidoVenda/findByClient/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function validateExistingPlaques(placa: string): Promise<[]> {
  const res = await fetch(
    `${url}/PedidoVendaProduto/GetValidaPlacaJaExiste/${placa}`
  );

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
export async function updatePlaques(order: OrderFormData) {
  const res = await fetch(`${url}/PedidoVendaProduto`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to update data");
  }
}

export async function destroyOrder(id: string): Promise<void> {
  const res = await fetch(`${url}/PedidoVenda/${id}`, { method: "delete" });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function getPlaques(id: string): Promise<IOrder[]> {
  const res = await fetch(`${url}/PedidoVendaProduto/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function filterOrderByDate(
  startDate: string,
  endDate: string
): Promise<IOrder[]> {
  const res = await fetch(
    `${url}/PedidoVenda/findByDate/${startDate}/${endDate}`
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
