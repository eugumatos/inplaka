import { ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

interface ModalDialogProps {
  isOpen: boolean;
  maxWidth: string;
  textAction?: string;
  textClose?: string;
  noFooter?: boolean;

  children: ReactNode;
  onClose: () => void;
  onAction: () => void;
}

export function ModalDialog({
  isOpen,
  maxWidth,
  textAction = "Criar",
  textClose = "Cancelar",
  noFooter = false,
  onClose,
  onAction,
  children,
}: ModalDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxW={maxWidth}>
        <ModalCloseButton />

        <ModalBody pb={6}>{children}</ModalBody>

        <ModalFooter hidden={noFooter}>
          <Button
            onClick={onAction}
            bg="pink.300"
            color="gray.50"
            mr={3}
            _hover={{
              bg: "pink.400",
            }}
          >
            {textAction}
          </Button>
          <Button
            bg="gray.100"
            color="gray.700"
            _hover={{
              bg: "gray.50",
            }}
            onClick={onClose}
          >
            {textClose}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
