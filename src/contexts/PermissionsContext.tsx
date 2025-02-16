import { IPermissions } from "@/domains/permissions";
import { permissionReducer } from "@/reducers/permissionReducer";
import { getAllPermissions, updatePermissions } from "@/services/permissions";
import { ReactNode, createContext, useContext, useReducer } from "react";
import { toast } from "react-toastify";

interface PermissionContextProps {
  children?: ReactNode;
  permissions?: Array<IPermissions>;
}

interface PermissionsProviderProps {
  isLoading: boolean;
  isError: boolean;
  permissions: Array<IPermissions>;
  refetchPermissions: VoidFunction;
  editPermission: (permission: { idRota: string; idRole: string }) => void;
}

const PermissionsContext = createContext<PermissionsProviderProps>(
  {} as PermissionsProviderProps
);

function PermissionsProvider({
  permissions = [],
  children,
}: PermissionContextProps) {
  const [state, dispatch] = useReducer(permissionReducer, {
    permissions,
    isLoading: false,
    isError: false,
  });

  async function refetchPermissions() {
    try {
      dispatch({ type: "LOADING" });

      const updatedPermissions = await getAllPermissions();

      dispatch({ type: "RELOAD_PERMISSIONS", payload: updatedPermissions });
    } catch (error) {
      dispatch({ type: "ERROR" });
    }
  }

  async function editPermission(permissions: {
    idRota: string;
    idRole: string;
  }) {
    try {
      dispatch({ type: "LOADING" });

      await updatePermissions(permissions);
      const newPermissions = await getAllPermissions();

      dispatch({ type: "RELOAD_PERMISSIONS", payload: newPermissions });

      toast.success("Permissão editada com sucesso!");
    } catch (error) {
      dispatch({ type: "ERROR" });
      toast.error("Erro ao editar permissão");
    }
  }

  return (
    <PermissionsContext.Provider
      value={{
        isError: state.isError,
        isLoading: state.isLoading,
        permissions: state.permissions,

        refetchPermissions,
        editPermission,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

function usePermissions() {
  const context = useContext(PermissionsContext);

  return context;
}

export { PermissionsProvider, usePermissions };
