import { ReactNode } from "react";
import { useCan } from "../hooks/userCan";

interface CanProps {
  children: ReactNode;
  permissions?: string[];
}

export function Can({ children, permissions }: CanProps) {
  const userCanSeeComponent = useCan({ permissions });

  if (!userCanSeeComponent) {
    return null;
  }

  return <>{children}</>;
}
