import { FormEventHandler } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";
import { OrderForm } from "@/components/Forms/OrderForm";

interface OrderDraweProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function OrderDrawer({ isOpen, onClose, onSubmit }: OrderDraweProps) {
  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="xl">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <OrderForm onSubmit={onSubmit} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
