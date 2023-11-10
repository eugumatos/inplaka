import { StateProps, ActionProps } from "@/domains/reducer";
import {
  getCompanies,
  createCompany,
  updateCompany,
  destroyCompany,
} from "@/services/company";

export const initialState = {
  isLoading: false,
  error: false,
  copmanies: [],
};

export default async function companyReducer(state, action) {
  switch (action.type) {
    case "ADD_COMPANY":
      try {
        await createCompany(action.payload);

        return {
          ...state,
          companies: [...state.data, action.payload],
        };
      } catch (error) {}
    case "EDIT_COMPANY":
      try {
        await updateCompany(action.payload.id, action.payload.data);

        const updatedCompany = action.payload;

        const updatedCompanies = state.companies.map((company) => {
          if (company.id === updatedCompany.id) {
            return updatedCompany;
          }
          return company;
        });

        return {
          ...state,
          companies: updatedCompanies,
        };
      } catch (error) {}
    case "REMOVE_COMPANY":
      try {
        await destroyCompany(action.payload.id);

        return {
          ...state,
          companies: state.companies.filter(
            (company) => company.id !== action.payload
          ),
        };
      } catch (error) {}

    default:
      return state;
  }
}
