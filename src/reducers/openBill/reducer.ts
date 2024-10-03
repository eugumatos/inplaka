import { produce } from "immer";
import { IOpenBill } from "@/domains/open-bill";
import { ActionTypes } from "./action"

interface OpenBillState {
  openBills: Array<IOpenBill>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export function openBillReducer(state: OpenBillState, action: any): OpenBillState {
  switch (action.type) {
    case ActionTypes.LOADING:
      return {
        ...state,
        isSuccess: false,
        isError: false,
        isLoading: true
      }
    case ActionTypes.ERROR:
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        isError: true
      }
    case ActionTypes.EDIT_ACTIVE_OPEN_BILL: {
      return {
        ...state,
        isError: false,
        isLoading: false,
        isSuccess: true,
        openBills: produce(state.openBills, draft => {
          const index = state.openBills.findIndex(o => o.descricao === action.payload.updateOpenBill?.descricao)
          draft[index] = action.payload.updateOpenBill;
        })
      }
    }

    default:
      return state;
  }
}