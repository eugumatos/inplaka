import { ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { RiFullscreenExitFill } from "react-icons/ri";

interface ModalDialogProps {
  isOpen: boolean;

  children: ReactNode;
  onClose: () => void;
}

export function FullModal({ isOpen, onClose, children }: ModalDialogProps) {
  return (
    <Modal
      size="full"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody pb={6}>{children}</ModalBody>

        <ModalFooter>
          <Tooltip label="Sair da tela inteira">
            <IconButton
              aria-label=""
              size="md"
              bg="gray.300"
              onClick={onClose}
              icon={<RiFullscreenExitFill color="#fff" />}
            />
          </Tooltip>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
