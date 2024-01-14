import { url } from "@/constants";
import { PaymentTermFormData } from "@/schemas/PaymentTermSchemaValidation";
import { IPaymentTerms } from "@/domains/payment-term";

export async function getPaymentTerms(): Promise<IPaymentTerms[]> {
  const res = await fetch(`${url}/CondicaoPagamento`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getPaymentTerm(id: string): Promise<IPaymentTerms> {
  const res = await fetch(`${url}/CondicaoPagamento/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function destroyPaymentTerm(id: string): Promise<void> {
  const res = await fetch(`${url}/CondicaoPagamento/${id}`, {
    method: "delete",
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function createPaymentTerm(paymentTerm: PaymentTermFormData) {
  const res = await fetch(`${url}/CondicaoPagamento`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentTerm),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function updatePaymentTerm(paymentTerm: PaymentTermFormData) {
  const res = await fetch(`${url}/CondicaoPagamento`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paymentTerm),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}
