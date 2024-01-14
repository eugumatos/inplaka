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
  destroyClient,
  getClients,
  updateClient,
} from "@/services/clients";
import { getSellers } from "@/services/seller";
import { toast } from "react-toastify";

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
