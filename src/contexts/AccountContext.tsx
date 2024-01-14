import { ReactNode, createContext, useReducer, useContext } from "react";
import { AccountFormData } from "@/schemas/AccountSchemaValidation";
import { IAccount } from "@/domains/account";
import { accountReducer } from "@/reducers/accountReducer";
import {
  createAccount,
  destroyAccount,
  getAccounts,
  updateAccount,
} from "@/services/account";
import { toast } from "react-toastify";
import currency from "currency.js";

interface AccountContextProps {
  children?: ReactNode;
  accounts?: Array<IAccount>;
}

interface AccountProviderProps {
  isLoading: boolean;
  isError: boolean;
  accounts: Array<IAccount>;
  addAccount: (account: AccountFormData) => void;
  editAccount: (account: AccountFormData) => void;
  removeAccount: (account: IAccount) => void;
}

const AccountContext = createContext<AccountProviderProps>(
  {} as AccountProviderProps
);

function AccountProvider({ accounts = [], children }: AccountContextProps) {
  const [state, dispatch] = useReducer(accountReducer, {
    accounts,
    isLoading: false,
    isError: false,
  });

  async function addAccount(account: AccountFormData) {
    try {
      Object.assign(account, { saldo: currency(account.saldo) });

      dispatch({ type: "LOADING" });
      await createAccount(account);

      const newAccounts = await getAccounts();

      dispatch({ type: "RELOAD_ACCOUNT", payload: newAccounts });

      toast.success("Conta criada com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao criar conta");
    }
  }

  async function editAccount(account: AccountFormData) {
    try {
      Object.assign(account, { saldo: currency(account.saldo) });

      dispatch({ type: "LOADING" });

      const findAccountId = state.accounts.find(
        (a) => a.descricao === account.descricao
      );

      if (!findAccountId) {
        throw new Error("Account ID not found!");
      }

      await updateAccount(findAccountId.id, account);
      const newAccounts = await getAccounts();

      dispatch({ type: "RELOAD_ACCOUNT", payload: newAccounts });

      toast.success("Conta editada com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar conta");
    }
  }

  async function removeAccount(account: IAccount) {
    try {
      dispatch({ type: "LOADING" });

      const findAccountId = state.accounts.find(
        (a) => a.descricao === account.descricao
      );

      if (!findAccountId) {
        throw new Error("Account ID not found!");
      }

      await destroyAccount(findAccountId.id);

      const accounts = await getAccounts();

      dispatch({ type: "RELOAD_ACCOUNT", payload: accounts });

      toast.success("Conta removida com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover conta");
    }
  }

  return (
    <AccountContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        accounts: state.accounts,
        addAccount,
        removeAccount,
        editAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

function useAccounts() {
  const context = useContext(AccountContext);

  return context;
}

export { AccountProvider, useAccounts };
