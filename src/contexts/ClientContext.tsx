import {
  ReactNode,
  createContext,
  useReducer,
  useContext,
  useEffect,
} from "react";
import { ClientFormData } from "@/schemas/ClientSchemaValidation";
import { IClient } from "@/domains/client";
import { clientReducer } from "@/reducers/clientReducer";
import {
  createClient,
  createClientProduct,
  destroyClient,
  getClients,
  updateClient,
} from "@/services/clients";
import { getSellers } from "@/services/seller";
import { toast } from "react-toastify";
import { ProductFormByClientData } from "@/schemas/ProductSchemaValidation";
import { unmaskText } from "@/utils/unmaskText";

interface SelectProps {
  label: string;
  value: string;
}

interface ClientContextProps {
  children?: ReactNode;
  clients?: Array<IClient>;
}

interface ClientProviderProps {
  isLoading: boolean;
  isError: boolean;
  clients: Array<IClient>;
  addClient: (client: ClientFormData) => void;
  editClient: (client: ClientFormData) => void;
  removeClient: (client: IClient) => void;
  sellerOptions: (value: string) => Promise<SelectProps[]>;
  editProductByClient: (client: ProductFormByClientData) => void;
}

const ClientContext = createContext<ClientProviderProps>(
  {} as ClientProviderProps
);

function ClientProvider({ clients = [], children }: ClientContextProps) {
  const [state, dispatch] = useReducer(clientReducer, {
    clients,
    isLoading: false,
    isError: false,
  });

  async function sellerOptions(value: string) {
    try {
      const sellers = await getSellers();
      const options = sellers
        .map((seller) => ({
          value: seller.id,
          label: seller.apelido,
        }))
        .filter((item) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar vendedores");

      return [];
    }
  }

  async function addClient(client: ClientFormData) {
    try {
      dispatch({ type: "LOADING" });

      Object.assign(client, {
        consumidor_final: Boolean(client.consumidor_final),
        vendedorPadrao: client.vendedorPadrao.value,
      });

      await createClient(client);

      const newClients = await getClients();

      dispatch({ type: "RELOAD_CLIENT", payload: newClients });

      toast.success("Cliente criado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao criar cliente");
    }
  }

  async function editClient(client: ClientFormData) {
    try {
      dispatch({ type: "LOADING" });

      Object.assign(client, {
        consumidor_final: Boolean(client.consumidor_final),
        vendedorPadrao: client.vendedorPadrao.value,
      });

      await updateClient(client);
      const newClients = await getClients();

      dispatch({ type: "RELOAD_CLIENT", payload: newClients });

      toast.success("Cliente editado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar cliente");
    }
  }

  async function editProductByClient(client: ProductFormByClientData) {
    try {
      dispatch({ type: "LOADING" });
        
      await createClientProduct({
        idCliente: client?.idCliente || '',
        idProduto: client.produto.value,
        preco: Number(unmaskText(client.valor_venda_cliente))
      });
      
      const newClients = await getClients();

      dispatch({ type: "RELOAD_CLIENT", payload: newClients });
      
      toast.success("Valor cliente produto editado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar valor cliente produto.");
    }
  }


  async function removeClient(client: IClient) {
    try {
      dispatch({ type: "LOADING" });

      const findClientId = state.clients.find((c) => c.nome === client.nome);

      if (!findClientId) {
        throw new Error("Client ID not found!");
      }

      await destroyClient(findClientId.id);

      const clients = await getClients();

      dispatch({ type: "RELOAD_CLIENT", payload: clients });

      toast.success("Cliente removida com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover cliente");
    }
  }

  return (
    <ClientContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        clients: state.clients,
        addClient,
        removeClient,
        editClient,
        sellerOptions,
        editProductByClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

function useClients() {
  const context = useContext(ClientContext);

  return context;
}

export { ClientProvider, useClients };
