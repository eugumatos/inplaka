import { ReactNode, createContext, useReducer } from "react";
import { companyReducer } from "@/reducers/companyReducer";

interface CompanyContextProps {
  children: ReactNode;
}

const CompanyContext = createContext({});

const initialState = {
  companies: [],
};

export function CompanyProvider({ children }: CompanyContextProps) {
  const [state, dispatch] = useReducer(companyReducer, initialState);

  function addEmployee(company) {
    dispatch({
      type: "ADD_EMPLOYEE",
      payload: employee,
    });
  }

  function editEmployee(company) {
    dispatch({
      type: "EDIT_EMPLOYEE",
      payload: employee,
    });
  }

  function removeEmployee(id) {
    dispatch({
      type: "REMOVE_EMPLOYEE",
      payload: id,
    });
  }

  return (
    <CompanyContext.Provider value={{}}>{children}</CompanyContext.Provider>
  );
}
