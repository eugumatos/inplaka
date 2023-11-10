export type StateProps<T> = {
  data?: T;
  error: Error;
  isLoading: boolean;
};

export type ActionProps<T> =
  | { type: "loading" }
  | { type: "fetched"; payload: T }
  | { type: "error"; payload: T };
