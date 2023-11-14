import React, { useMemo } from "react";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { DataTable } from "@/components/Table";
import { ModalDialog } from "@/components/Modals";
import { useOrder } from "@/contexts/OrderContext";
import { filterText } from "@/utils/filterText";
import { formatDate } from "@/utils/formatDate";
import { currency } from "@/utils/currency";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { OrderDrawer } from "./OrderDrawer";

export function Order() {
  const { orders, isLoading } = useOrder();

  const { handleSubmit, reset, setValue, formState } =
    useFormContext<OrderFormData>();

  const hasErrors = formState.isValid;

  const { isOpen, onOpen, onClose } = useDisclosure();

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

      <DataTable isLoading={isLoading} columns={columns} data={orders} />

      <OrderDrawer isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
