import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

interface DestroyModalProps {
  description?: string;

  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
}

export function DestroyModal({
  isOpen,
  onClose,
  onAction,
  description,
}: DestroyModalProps) {
  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="gray.500">
          Tem certeza que deseja excluir este item?
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{description}</ModalBody>

        <ModalFooter>
          <Button
            mr={3}
            bg="red.300"
            color="gray.50"
            onClick={onAction}
            _hover={{
              bg: "red.400",
            }}
          >
            Excluir
          </Button>
          <Button
            bg="gray.100"
            color="gray.600"
            onClick={onClose}
            _hover={{
              bg: "gray.50",
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
