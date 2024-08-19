import { url } from "@/constants";

export async function getAllPlaques(): Promise<any> {
  const res = await fetch(`${url}/PedidoVenda/findAllAberto`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getPlaque(id: string): Promise<any> {
  const res = await fetch(`${url}/BaixaPedido/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getPlaqueByDate(
  startDate: string | null,
  endDate: string | null
): Promise<[]> {
  const res = await fetch(
    `${url}/PedidoVenda/findByDate/${startDate}/${endDate}`
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getPlaqueByClientDate(
  client: string,
  startDate: string | null,
  endDate: string | null
): Promise<[]> {
  const res = await fetch(
    `${url}/PedidoVenda/findByClientDate/${client}/${startDate}/${endDate}`
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function sendOrderPlaque(plaque: any) {
  const res = await fetch(`${url}/BaixaPedido`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(plaque),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function filterByDate(id: string): Promise<any> {
  const res = await fetch(`${url}/Empresa/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function filterByDateClient(
  client: string,
  startDate: Date | null,
  endDate: Date | null
): Promise<[]> {
  const res = await fetch(
    `${url}/PedidoVenda/${client}/${startDate}/${endDate}`
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
