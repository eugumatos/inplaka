import { OpenBillFormData } from "@/schemas/OpenBillSchemaValidation"

export enum ActionTypes {
  LOADING = "LOADING",
  ERROR = "ERROR",
  EDIT_ACTIVE_OPEN_BILL = "EDIT_ACTIVE_OPEN_BILL",
}

export function loadingOpenBillAction() {
  return {
    type: ActionTypes.LOADING,
  };
}

export function errorOpenBillAction() {
  return {
    type: ActionTypes.ERROR,
  };
}

export function editOpenBillAction(updateOpenBill: OpenBillFormData) {
  return {
    type: ActionTypes.EDIT_ACTIVE_OPEN_BILL,
    payload: {
      updateOpenBill
    }
  };
}
