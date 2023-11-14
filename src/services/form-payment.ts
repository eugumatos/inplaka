import { url } from "@/constants";
import { IFormPayment } from "@/domains/form-payment";
import { FormPaymentFormData } from "@/schemas/FormPaymentSchemaValidation";

export async function getFormPayments() {
  const res = await fetch(`${url}/FormaPagamento`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function createFormPayment(formPayment: FormPaymentFormData) {
  await fetch(`${url}/FormaPagamento`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formPayment),
  });
}

export async function destroyFormPayment(id: string): Promise<void> {
  const res = await fetch(`${url}/FormaPagamento/${id}`, { method: "delete" });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}

export async function updateFormPayment(
  id: string,
  formPayment: FormPaymentFormData
) {
  const res = await fetch(`${url}/FormaPagamento/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formPayment),
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to delete data");
  }
}
