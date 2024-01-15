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
  isUpdate: boolean;
  onClose: () => void;
  onSubmit: any;
}

export function OrderDrawer({
  isOpen,
  isUpdate,
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
          <OrderForm isUpdate={isUpdate} onSubmit={onSubmit} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
