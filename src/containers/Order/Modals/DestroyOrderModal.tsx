import { useDisclosure } from "@chakra-ui/react";
import { DestroyModal } from "@/components/Modals/DestroyModal";

export function DestroyOrderModal() {
  const { isOpen, onClose } = useDisclosure();

  const handleDestroyOrder = () => {
    onClose();
  };

  return (
    <DestroyModal
      isOpen={isOpen}
      onClose={onClose}
      onAction={handleDestroyOrder}
    />
  );
}
