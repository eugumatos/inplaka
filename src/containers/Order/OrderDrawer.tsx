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
}

export function OrderDrawer({ isOpen, onClose }: OrderDraweProps) {
  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="xl">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <OrderForm />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
