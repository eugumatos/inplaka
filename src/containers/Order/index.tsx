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
    actionOrder,
    editOrder,
    removeOrder,
    filterOrder,
  } = useOrder();

  const {
    seekSelectedClientOption,
    seekSelectedSellerOption,
    seekSelectedPaymentOption,
  } = useOrderForm({ noFetch: true, shouldPreLoad: true });

  const { handleSubmit, setValue, reset } = useFormContext<OrderFormData>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const disclosureDestroyModal = useDisclosure();

  const [submitOption, setSubmitOption] = useState<"CREATE" | "UPDATE">(
    "CREATE"
  );

  const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);

  const subOption = {
    CREATE: (values: OrderFormData) => actionOrder(values, onClose),
    UPDATE: (values: OrderFormData) => editOrder(values, onClose),
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
    <Box w="100%" flex={1}>
      <Flex justifyContent="space-between" mb={4}>
        <Heading as="h3" fontSize={26}>
          Pedido de venda
        </Heading>
        <Button
          bg="pink.300"
          color="gray.50"
          size="md"
          onClick={() => {
            setSubmitOption("CREATE");
            setCurrentOrder(null);
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

      <Box mt={5}>
        <DataTable
          isLoading={isLoading}
          columns={columns}
          data={orders}
          onRowEdit={(row) => {
            setSubmitOption("UPDATE");

            Object.keys(row).forEach(async (key: any) => {
              if (key === "cliente") {
                const client = await seekSelectedClientOption(row.cliente);

                return setValue(key, client);
              }
              if (key === "vendedor") {
                const seller = await seekSelectedSellerOption(row.vendedor);

                return setValue(key, seller);
              }
              if (key === "formaPagamento") {
                const paymentOption = await seekSelectedPaymentOption(
                  row.formaPagamento
                );

                return setValue(key, paymentOption);
              }

              return setValue(key, row[key]);
            });

            seekCurrentOrder(row);
            onOpen();
          }}
          onRowDelete={(row) => {
            if (row.status !== "ABERTO") {
              seekCurrentOrder(row);
              disclosureDestroyModal.onOpen();
            }
          }}
          onFilterByDate={filterOrder}
        />
      </Box>

      <OrderDrawer
        id={currentOrder?.id}
        isOpen={isOpen}
        onSubmit={(data: OrderFormData) => actionOrder(data, onClose)}
        onClose={() => {
          onClose();
          setCurrentOrder(null);
          reset({});
        }}
      />

      {renderDestroyModal()}
      {renderFinishingOrderModal()}
    </Box>
  );
}
