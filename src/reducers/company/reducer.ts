import { produce } from "immer";
import { ICompany } from "@/domains/company";
import { ActionTypes } from "./action"

interface CompaniesState {
  companies: Array<ICompany>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export function companyReducer(state: CompaniesState, action: any): CompaniesState {
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
    case ActionTypes.ADD_NEW_COMPANY:
      return {
        ...state,
        isError: false,
        isLoading: false,
        isSuccess: true,
        companies: produce(state.companies, (draft) => {
          draft.unshift(action.payload.newCompany);
        }),
    }
    case ActionTypes.EDIT_ACTIVE_COMPANY: {
      return {
        ...state,
        isError: false,
        isLoading: false,
        isSuccess: true,
        companies: produce(state.companies, draft => {
          const index = state.companies.findIndex(c => c.cnpj === action.payload.updatedCompany?.cnpj)
          draft[index] = action.payload.updatedCompany;
      })
    }} 
    case ActionTypes.DELETE_COMPANY: {
      return {
        ...state,
        isError: false,
        isLoading: false,
        isSuccess: true,
        companies: produce(state.companies, (draft) => {
          const index = draft.findIndex(company => company.id === action.payload.id)
          if (index !== -1) draft.splice(index, 1)
        })
    }}
    
    default:
      return state;
  }
}