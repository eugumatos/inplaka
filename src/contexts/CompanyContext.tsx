import { ReactNode, createContext, useReducer, useContext, useCallback } from "react";
import { CompanyFormData } from "@/schemas/CompanySchemaValidation";
import { ICompany } from "@/domains/company";
import { companyReducer } from "@/reducers/company/reducer";
import { loadingCompanyAction, errorCompanyAction, addNewCompanyAction, editCompanyAction, deleteCompanyAction } from "@/reducers/company/action"
import {
  createCompany,
  destroyCompany,
  updateCompany,
} from "@/services/company";
import { toast } from "react-toastify";

interface CompanyContextProps {
  children?: ReactNode;
  companies?: Array<ICompany>;
}

interface CompanyProviderProps {
  isLoading: boolean;
  isError: boolean;
  companies: Array<ICompany>;
  addCompany: (company: CompanyFormData) => void;
  editCompany: (company: CompanyFormData) => void;
  removeCompany: (company: ICompany) => void;
}

const CompanyContext = createContext<CompanyProviderProps>(
  {} as CompanyProviderProps
);

function CompanyProvider({ companies = [], children }: CompanyContextProps) {
  const [companyState, dispatch] =  useReducer(companyReducer, {
      companies,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });

  async function addCompany(company: CompanyFormData) {
    try {
      dispatch(loadingCompanyAction());
      
      await createCompany(company);

      dispatch(addNewCompanyAction(company));

      toast.success("Empresa criada com sucesso!");
    } catch (error) {
      dispatch(errorCompanyAction());
      toast.error("Erro ao criar empresa");
    }
  }

  async function editCompany(company: CompanyFormData) {
    try {
      dispatch(loadingCompanyAction());

      await updateCompany(company);
    
      dispatch(editCompanyAction(company));

      toast.success("Empresa editada com sucesso!");
    } catch (error) {
      dispatch(errorCompanyAction());
      toast.error("Erro ao editar empresa");
    }
  }

  async function removeCompany(company: ICompany) {
    try {
      dispatch(loadingCompanyAction());
    
      await destroyCompany(company.id);

      dispatch(deleteCompanyAction(company.id));

      toast.success("Empresa removida com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover empresa");
    }
  }

  return (
    <CompanyContext.Provider
      value={{
        isError: companyState.isError,
        isLoading: companyState.isLoading,
        companies: companyState.companies,
        addCompany,
        removeCompany,
        editCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

function useCompanies() {
  const context = useContext(CompanyContext);

  return context;
}

export { CompanyProvider, useCompanies };
