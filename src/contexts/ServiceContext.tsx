import { ReactNode, createContext, useReducer, useContext } from "react";
import { IService } from "@/domains/service";
import { serviceReducer } from "@/reducers/serviceReducer";
import {
  createService,
  destroyService,
  updateService,
  getServices,
} from "@/services/service";
import { toast } from "react-toastify";
import { ServiceFormData } from "@/schemas/ServiceSchemaValidation";
import currency from "currency.js";

interface ServiceContextProps {
  children?: ReactNode;
  services?: Array<IService>;
}

interface ServiceProviderProps {
  isLoading: boolean;
  isError: boolean;
  services: Array<IService>;
  addService: (service: ServiceFormData) => void;
  editService: (service: ServiceFormData) => void;
  removeService: (service: IService) => void;
}

const ServiceContext = createContext<ServiceProviderProps>(
  {} as ServiceProviderProps
);

function ServiceProvider({ services = [], children }: ServiceContextProps) {
  const [state, dispatch] = useReducer(serviceReducer, {
    services,
    isLoading: false,
    isError: false,
  });

  async function addService(service: ServiceFormData) {
    try {
      dispatch({ type: "LOADING" });

      Object.assign(service, {
        nao_usar_para_nota_fiscal: Boolean(service.nao_usar_para_nota_fiscal),
        valor_venda: currency(service.valor_venda),
      });

      await createService(service);

      const newServices = await getServices();

      dispatch({ type: "RELOAD_SERVICE", payload: newServices });

      toast.success("Serviço criado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao criar serviço");
    }
  }

  async function editService(service: ServiceFormData) {
    try {
      dispatch({ type: "LOADING" });

      Object.assign(service, {
        nao_usar_para_nota_fiscal: Boolean(service.nao_usar_para_nota_fiscal),
        valor_venda: currency(service.valor_venda),
      });

      await updateService(service);
      const newServices = await getServices();

      dispatch({ type: "RELOAD_SERVICE", payload: newServices });

      toast.success("Serviço editado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar serviço");
    }
  }

  async function removeService(service: IService) {
    try {
      dispatch({ type: "LOADING" });

      const findIdService = state.services.find((s) => s.id === service.id);

      if (!findIdService) {
        throw new Error("ID Service not found!");
      }

      await destroyService(findIdService.id);

      const services = await getServices();

      dispatch({ type: "RELOAD_SERVICE", payload: services });

      toast.success("Serviço removido com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover serviço");
    }
  }

  return (
    <ServiceContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        services: state.services,
        addService,
        removeService,
        editService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

function useService() {
  const context = useContext(ServiceContext);

  return context;
}

export { ServiceProvider, useService };
