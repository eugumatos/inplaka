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
import { upper } from "@/utils/upper";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { IOrder } from "@/domains/order";
import { ModalDialog } from "@/components/Modals";
import { OrderDrawer } from "./OrderDrawer";
import { FinishingModal } from "./FinishingModal";
import { useOrderForm } from "@/containers/Order/hooks/useOrderForm";

export function Order() {
  const {
    orders,
    isLoading,
    finishingModalShouldBeOpen,
    closeFinishingModal,
    addOrder,
    editOrder,
    removeOrder,
    searchOrder,
  } = useOrder();

  let isUpdate = false;

  const { enableFormOrder, disableFormOrder, loadServicesAndProducts } =
    useOrderForm();

  const { setValue, handleSubmit, reset } = useFormContext<OrderFormData>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const disclosureDestroyModal = useDisclosure();

  const [submitOption, setSubmitOption] = useState<"CREATE" | "UPDATE">(
    "CREATE"
  );

  const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);

  const subOption = {
    CREATE: handleSubmit((values) => addOrder(values, onClose)),
    UPDATE: handleSubmit((values) => editOrder(values, onClose)),
  };

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
        accessor: "valorPedido",
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

  const renderFinishingOrderModal = () => {
    return (
      <FinishingModal
        isOpen={finishingModalShouldBeOpen}
        onClose={closeFinishingModal}
      />
    );
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
          onClick={() => {
            enableFormOrder();
            setSubmitOption("CREATE");
            reset({});
            onOpen();
          }}
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
        onRowEdit={async (row) => {
          disableFormOrder();
          setSubmitOption("UPDATE");

          onOpen();
        }}
        onRowDelete={(row) => {
          seekCurrentOrder(row);
          disclosureDestroyModal.onOpen();
        }}
      />

      <OrderDrawer
        isOpen={isOpen}
        isUpdate={isUpdate}
        onSubmit={subOption[submitOption]}
        onClose={() => {
          onClose();
          reset({});
        }}
      />

      {renderDestroyModal()}
      {renderFinishingOrderModal()}
    </Box>
  );
}
