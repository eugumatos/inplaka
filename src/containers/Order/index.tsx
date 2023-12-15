import React, { useMemo, useState } from "react";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { DataTable } from "@/components/Table";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { useOrder } from "@/contexts/OrderContext";
import { filterText } from "@/utils/filterText";
import { formatDate } from "@/utils/formatDate";
import { currency } from "@/utils/currency";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { OrderDrawer } from "./OrderDrawer";
import { ModalDialog } from "@/components/Modals";
import { IOrder } from "@/domains/order";

export function Order() {
  const { orders, isLoading, addOrder, editOrder, removeOrder } = useOrder();

  const { setValue, handleSubmit } = useFormContext<OrderFormData>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const customDisclosure = () => {
    return {};
  };

  const disclosureDestroyModal = useDisclosure();

  const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);

  const submitOptions = {
    create: handleSubmit(addOrder),
    update: handleSubmit(editOrder),
  };

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Cliente",
        accessor: "cliente",
        Cell: ({ value }) => filterText(value, 20),
      },
      {
        Header: "Data Emissão",
        accessor: "dateCreated",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Vendedor",
        accessor: "vendedor",
        Cell: ({ value }) => filterText(value, 20),
      },
      {
        Header: "Valor do pedido",
        accessor: "valorPedido",
        Cell: ({ value }) => currency(value),
      },
      {
        Header: "Status",
        accessor: "status",
      },
    ],
    []
  );

  const seekCurrentOrder = (order: IOrder) => {
    const findOrder = orders.find((o) => order.id === o.id);

    if (findOrder) {
      setCurrentOrder(findOrder);
    }
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => {
          if (currentOrder?.id) {
            removeOrder(currentOrder.id);
          }

          disclosureDestroyModal.onClose();
        }}
      />
    );
  };

  const handleUpdate = () => {
    console.log("upadted order");
  };

  return (
    <Box flex={1}>
      <Flex justifyContent="space-between" mb={8}>
        <Heading as="h3" fontSize={26}>
          Pedido de venda
        </Heading>
        <Button
          bg="pink.300"
          color="gray.50"
          size="md"
          onClick={onOpen}
          _hover={{
            bg: "pink.400",
          }}
        >
          CRIAR PEDIDO
        </Button>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={orders}
        onRowEdit={(row) => {
          Object.keys(row).forEach((key: any) => {
            return setValue(key, row[key]);
          });

          onOpen();
        }}
        onRowDelete={(row) => {
          seekCurrentOrder(row);
          disclosureDestroyModal.onOpen();
        }}
      />

      <OrderDrawer
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={submitOptions.create}
      />

      {renderDestroyModal()}
    </Box>
  );
}
