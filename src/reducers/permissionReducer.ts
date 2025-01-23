import { IPermissions } from "@/domains/permissions";

type State = {
  permissions: Array<IPermissions>;
  isLoading: boolean;
  isError: boolean;
};

type Action =
  | { type: "RELOAD_PERMISSIONS"; payload: Array<IPermissions> }
  | { type: "LOADING" }
  | { type: "ERROR" };

export function permissionReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RELOAD_PERMISSIONS":
      try {
        return {
          permissions: action.payload,
          isLoading: false,
          isError: false,
        };
      } catch (error) {
        return { ...state, isLoading: false, isError: true };
      }
    case "LOADING": {
      return { ...state, isLoading: true, isError: false };
    }
    case "ERROR": {
      return { ...state, isLoading: false, isError: true };
    }
    default:
      return { ...state };
  }
}
