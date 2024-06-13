import { CompanyFormData } from "@/schemas/CompanySchemaValidation"

export enum ActionTypes {
  LOADING = "LOADING",
  ERROR = "ERROR",
  ADD_NEW_COMPANY = "ADD_NEW_COMPANY",
  EDIT_ACTIVE_COMPANY = "EDIT_ACTIVE_COMPANY",
  DELETE_COMPANY = "DELETE_COMPANY",
}

export function loadingCompanyAction() {
  return {
    type: ActionTypes.LOADING,
  };
}

export function errorCompanyAction() {
  return {
    type: ActionTypes.ERROR,
  };
}

export function addNewCompanyAction(newCompany: CompanyFormData) {
  return {
    type: ActionTypes.ADD_NEW_COMPANY,
    payload: {
      newCompany,
    },
  };
}

export function editCompanyAction(updatedCompany: CompanyFormData) {
  return {
    type: ActionTypes.EDIT_ACTIVE_COMPANY,
    payload: {
      updatedCompany
    }
  };
}

export function deleteCompanyAction(id: string) {
  return {
    type: ActionTypes.DELETE_COMPANY,
    payload: {
      id
    }
  };
}

