import { url } from "@/constants";
import { BillFormData } from "@/schemas/BillSchemaValidation";
import { IBill } from "@/domains/bill";

export async function getBills(): Promise<IBill[]> {
  const res = await fetch(`${url}/ContasPagar`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getBill(id: string): Promise<IBill> {
  const res = await fetch(`${url}/ContasPagar/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function createBill(bill: BillFormData) {
  await fetch(`${url}/ContasPagar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bill),
  });
}

export async function destroyBill(id: string): Promise<void> {
  const res = await fetch(`${url}/ContasPagar/${id}`, { method: "delete" });

  if (!res.ok) {
    throw new Error("Failed to delete data");
  }
}

export async function updateBill(bill: BillFormData) {
  const res = await fetch(`${url}/ContasPagar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bill),
  });

  if (!res.ok) {
    throw new Error("Failed to delete data");
  }
}
