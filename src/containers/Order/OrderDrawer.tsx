import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { OrderForm } from "@/components/Forms/OrderForm";

interface OrderDraweProps {
  onClose: () => void;

  isOpen: boolean;
  isLoadingContent?: boolean;
}

export function OrderDrawer({
  isOpen,
  onClose,
  isLoadingContent,
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
          {isLoadingContent ? (
            <Center w="100%" h="90vh">
              <Spinner size="lg" />
            </Center>
          ) : (
            <OrderForm id={""} onSubmit={() => {}} />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
