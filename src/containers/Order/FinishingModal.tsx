import { useOrder } from "@/contexts/OrderContext";
import { IClient } from "@/domains/client";
import { getClients } from "@/services/clients";
import { currency } from "@/utils/currency";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PDFDocument } from "./document";

interface DestroyModalProps {
  description?: string;

  isOpen: boolean;
  onClose: () => void;
}

export function FinishingModal({
  isOpen,
  onClose,
  description,
}: DestroyModalProps) {
  const { order, currentOrderNumber, closeFinishingModal } = useOrder();
  const [clients, setClients] = useState<IClient[]>([]);

  useEffect(() => {
    async function loadClients() {
      try {
        const allClients = await getClients();

        setClients(allClients);
      } catch (error) {
        toast.error("Erro ao carregar PDF.");
        closeFinishingModal();
      }
    }

    loadClients();
  }, []);

  const formattedValues = () => {
    const findClient = clients.find((client) => client.id === order.cliente);

    return {
      orderNumber: currentOrderNumber,
      orderDate: order?.dateCreated,
      clientName: findClient?.apelido,
      clientAddress: findClient?.ender_logradouro,
      clientNeighborhood: findClient?.ender_bairro,
      clientCity: findClient?.ender_cidade,
      clientEmail: findClient?.email,
      products: order.produtos?.map((p: any) => {
        return {
          name: p.descricao,
          amount: p.quantidade,
          plaque: p.placa,
          value: currency(p.valorUnitario),
        };
      }),
      totalServices: currency(order.totalServices),
      total: currency(order.total),
    };
  };

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="gray.500">
          Deseja imprimir com ou sem valores?
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{description}</ModalBody>

        <ModalFooter>
          <PDFDownloadLink
            document={
              <PDFDocument order={formattedValues()} shouldRenderValues />
            }
            fileName={`${currentOrderNumber}_pedido-comvalor.pdf`}
          >
            <Button
              mr={3}
              bg="orange.300"
              color="gray.50"
              onClick={() => {
                closeFinishingModal();
                onClose();
              }}
              _hover={{
                bg: "orange.200",
              }}
            >
              COM VALOR
            </Button>
          </PDFDownloadLink>
          <PDFDownloadLink
            document={
              <PDFDocument
                order={formattedValues()}
                shouldRenderValues={false}
              />
            }
            fileName={`${currentOrderNumber}_pedido-semvalor.pdf`}
          >
            <Button
              bg="gray.100"
              color="gray.600"
              onClick={() => {
                closeFinishingModal();
                onClose();
              }}
              _hover={{
                bg: "gray.50",
              }}
            >
              SEM VALOR
            </Button>
          </PDFDownloadLink>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
