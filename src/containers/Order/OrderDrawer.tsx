import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";
import { OrderForm } from "@/components/Forms/OrderForm";

interface OrderDraweProps {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: any;
}

export function OrderDrawer({
  id,
  isOpen,
  onClose,
  onSubmit,
}: OrderDraweProps) {
  return (
    <Drawer
      onClose={onClose}
      isOpen={isOpen}
      size="xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <OrderForm id={id} onSubmit={onSubmit} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
