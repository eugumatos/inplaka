import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { DataTable } from "@/components/Table";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { useOrder } from "@/contexts/OrderContext";
import { filterText } from "@/utils/filterText";
import { formatDate } from "@/utils/formatDate";
import { currency } from "@/utils/currency";
import { upper } from "@/utils/upper";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { IOrder } from "@/domains/order";
import { useOrderForm } from "./hooks/useOrderForm";
import { OrderDrawer } from "./OrderDrawer";
import { FinishingModal } from "./FinishingModal";

export function Order() {
  const {
    orders,
    isLoading,
    finishingModalShouldBeOpen,
    closeFinishingModal,
    addOrder,
    editOrder,
    removeOrder,
    filterOrder,
  } = useOrder();

  const { handleSubmit, setValue, reset } = useFormContext<OrderFormData>();
  const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);

  const disclosureDrawerModal = useDisclosure();
  const disclosureDestroyModal = useDisclosure();

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Número",
        accessor: "numero",
      },
      {
        Header: "Cliente",
        accessor: "clienteNome",
        Cell: ({ value }) => filterText(upper(value), 20),
      },
      {
        Header: "Data Emissão",
        accessor: "dateCreated",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Valor do pedido",
        accessor: "valorTotal",
        Cell: ({ value }) => currency(value),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => upper(value),
      },
    ],
    []
  );

  const handleCreateOrder = () => {
    disclosureDrawerModal.onOpen();
  };

  const handleEditOrder = () => {
    disclosureDrawerModal.onOpen();
  };

  const handleCloseDrawer = () => {
    disclosureDrawerModal.onClose();
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => {
          disclosureDestroyModal.onClose();
        }}
      />
    );
  };

  const renderFinishingOrderModal = () => {
    return (
      <FinishingModal
        isOpen={finishingModalShouldBeOpen}
        onClose={closeFinishingModal}
      />
    );
  };

  return (
    <Box w="100%" flex={1}>
      <Flex justifyContent="space-between" mb={4}>
        <Heading as="h3" fontSize={26}>
          Pedido de venda
        </Heading>
        <Button
          bg="pink.300"
          color="gray.50"
          size="md"
          onClick={handleCreateOrder}
          _hover={{
            bg: "pink.400",
          }}
        >
          CRIAR PEDIDO
        </Button>
      </Flex>

      <Box mt={5}>
        <DataTable
          isLoading={isLoading}
          columns={columns}
          data={orders}
          onRowEdit={handleEditOrder}
          onRowDelete={(row) => {
            disclosureDestroyModal.onOpen();
          }}
          onFilterByDate={filterOrder}
        />
      </Box>

      <OrderDrawer
        isLoadingContent
        isOpen={disclosureDrawerModal.isOpen}
        onClose={handleCloseDrawer}
      />

      {renderDestroyModal()}
      {renderFinishingOrderModal()}
    </Box>
  );
}
