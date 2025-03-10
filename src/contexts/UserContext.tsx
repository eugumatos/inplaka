import { IUser } from "@/domains/user";
import { userReducer } from "@/reducers/userReducer";
import { UserFormData } from "@/schemas/UserSchemaValidation";
import { createUser, destroyUser, getUsers, updateUser } from "@/services/user";
import { ReactNode, createContext, useContext, useReducer } from "react";
import { toast } from "react-toastify";

interface UserContextProps {
  children?: ReactNode;
  users?: Array<IUser>;
}

interface UserProviderProps {
  isLoading: boolean;
  isError: boolean;
  users: Array<IUser>;
  addUser: (user: UserFormData) => void;
  editUser: (user: UserFormData) => void;
  removeUser: (user: IUser) => void;
}

export enum userRoleTitle {
  ADMINISTRADOR = 0,
  VENDEDOR = 1,
  FINANCEIRO = 2,
  BACKOFFICE = 3,
}

const UserContext = createContext<UserProviderProps>({} as UserProviderProps);

function UserProvider({ users = [], children }: UserContextProps) {
  const [state, dispatch] = useReducer(userReducer, {
    users,
    isLoading: false,
    isError: false,
  });

  async function addUser(user: UserFormData) {
    try {
      dispatch({ type: "LOADING" });

      const newUser = {
        ...user,
        role: user.role.value,
      };

      await createUser(newUser as never);

      const newUsers = await getUsers();

      dispatch({ type: "RELOAD_USERS", payload: newUsers });

      toast.success("Usuário criado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao criar usuário");
    }
  }

  async function editUser(user: UserFormData) {
    try {
      dispatch({ type: "LOADING" });

      const newUser = {
        ...user,
        role: user.role.value,
      };

      await updateUser(newUser as never);
      const newUsers = await getUsers();

      dispatch({ type: "RELOAD_USERS", payload: newUsers });

      toast.success("Usuário editado com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar usuário");
    }
  }

  async function removeUser(user: IUser) {
    try {
      dispatch({ type: "LOADING" });

      const findUserId = state.users.find((u) => u.email === user.email);

      if (!findUserId) {
        throw new Error("User ID not found!");
      }

      await destroyUser(findUserId.id);

      const users = await getUsers();

      dispatch({ type: "RELOAD_USERS", payload: users });

      toast.success("Usuário removido com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao remover usuário");
    }
  }

  return (
    <UserContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        users: state.users,
        addUser,
        removeUser,
        editUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

function useUsers() {
  const context = useContext(UserContext);

  return context;
}

export { UserProvider, useUsers };
