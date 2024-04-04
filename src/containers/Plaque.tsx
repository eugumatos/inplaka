import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  FormLabel,
  HStack,
  Checkbox,
  useDisclosure,
} from "@chakra-ui/react";
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { IClient } from "@/domains/client";
import { IOrder } from "@/domains/order";

import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { DataTable } from "@/components/Table";
import { currency } from "@/utils/currency";
import { formatDate } from "@/utils/formatDate";
import { Column } from "react-table";
import { upper } from "@/utils/upper";
import { ModalDialog } from "@/components/Modals";

interface PlaqueProps {
  clients: IClient[];
  orders: IOrder[];
}

export function Plaque({ clients, orders }: PlaqueProps) {
  const [tableData, setTableData] = useState<IOrder[] | []>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [client, setClient] = useState({ value: "", label: "" });

  const { control, register, watch } = useForm();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentClient = watch("cliente") as any;

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Número",
        accessor: "numero",
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

  async function clientOptions(value: string) {
    try {
      const sellers = clients || [];
      const options = sellers
        .map((seller) => ({
          value: seller.id,
          label: seller.apelido,
        }))
        .filter((item) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar vendedores");

      return [];
    }
  }

  function seekOrdersbyClient() {
    setIsLoadingData(true);
    const filteredOrders = orders.filter((o) => o.cliente === client.value);

    setIsLoadingData(false);
    setTableData(filteredOrders);
  }

  const renderFormEditModal = () => {
    return (
      <ModalDialog
        maxWidth="70%"
        textAction="Editar"
        isOpen={isOpen}
        onClose={onClose}
        onAction={() => {}}
      >
        <Box mt={10}>
          <DataTable
            columns={[
              {
                Header: "Placa quitada",
                accessor: "placa_quitada",
                Cell: () => <Checkbox size="md" />,
              },
              {
                Header: "Nome",
                accessor: "nome",
              },
            ]}
            data={[
              {
                nome: "TESTE 1",
              },
              {
                nome: "TESTE 2",
              },
              {
                nome: "TESTE 3",
              },
            ]}
          />
        </Box>
      </ModalDialog>
    );
  };

  return (
    <Box w="100%" flex={1}>
      <Flex justifyContent="space-between" mb={8}>
        <Heading as="h3" fontSize={26}>
          Baixa de placas
        </Heading>
      </Flex>

      <HStack w="45%" mb={10}>
        <Box flex={1}>
          <FormLabel fontWeight="bold">Cliente:</FormLabel>
          <AsyncSelect
            control={control}
            loadOptions={clientOptions}
            value={currentClient}
            onChangeOption={setClient}
            {...register("cliente")}
          />
        </Box>
        <Button
          marginTop="auto"
          fontSize={15}
          bg="pink.300"
          color="gray.50"
          _hover={{
            bg: "pink.400",
          }}
          onClick={() => seekOrdersbyClient()}
        >
          BUSCAR
        </Button>
      </HStack>

      <DataTable
        isLoading={isLoadingData}
        columns={columns}
        data={tableData}
        onRowEdit={onOpen}
      />

      {renderFormEditModal()}
    </Box>
  );
}
