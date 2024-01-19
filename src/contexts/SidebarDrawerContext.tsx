import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/router";

interface SidebarDrawerProviderProps {
  children: ReactNode;
}

type SidebarDrawerContextData = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

const SidebarDrawerContext = createContext({} as SidebarDrawerContextData);

export function SidebarDrawerProvider({
  children,
}: SidebarDrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  useEffect(() => {
    onClose();
  }, [router.asPath]);

  return (
    <SidebarDrawerContext.Provider value={{ isOpen, onOpen, onClose }}>
      {children}
    </SidebarDrawerContext.Provider>
  );
}

export const useSidebarDrawer = () => useContext(SidebarDrawerContext);
