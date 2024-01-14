import { ReactNode, createContext, useReducer, useContext } from "react";
import { CompanyFormData } from "@/schemas/CompanySchemaValidation";
import { ICompany } from "@/domains/company";
import { companyReducer } from "@/reducers/companyReducer";
import {
  createCompany,
  destroyCompany,
  getCompanies,
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
  const [state, dispatch] = useReducer(companyReducer, {
    companies,
    isLoading: false,
    isError: false,
  });

  async function addCompany(company: CompanyFormData) {
    try {
      dispatch({ type: "LOADING" });
      await createCompany(company);

      const newCompanies = await getCompanies();

      dispatch({ type: "RELOAD_COMPANY", payload: newCompanies });

      toast.success("Empresa criada com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao criar empresa");
    }
  }

  async function editCompany(company: CompanyFormData) {
    try {
      dispatch({ type: "LOADING" });

      await updateCompany(company);
      const newCompanies = await getCompanies();

      dispatch({ type: "RELOAD_COMPANY", payload: newCompanies });

      toast.success("Empresa editada com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar empresa");
    }
  }

  async function removeCompany(company: ICompany) {
    try {
      dispatch({ type: "LOADING" });

      const findIdCompany = state.companies.find(
        (c) => c.cnpj === company.cnpj
      );

      if (!findIdCompany) {
        throw new Error("ID Company not found!");
      }

      await destroyCompany(findIdCompany.id);

      const companies = await getCompanies();

      dispatch({ type: "RELOAD_COMPANY", payload: companies });

      toast.success("Empresa removida com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover empresa");
    }
  }

  return (
    <CompanyContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        companies: state.companies,
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
