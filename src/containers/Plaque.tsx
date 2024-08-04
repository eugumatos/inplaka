import { ModalDialog } from "@/components/Modals";
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { IClient } from "@/domains/client";
import { IOrder } from "@/domains/order";
import { getOrderByClient, updatePlaques } from "@/services/order";
import { formatDate } from "@/utils/formatDate";
import {
  Box,
  Button,
  Card,
  Flex,
  FormLabel,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/Table";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

import { Column } from "react-table";

import { PlaqueForm } from "@/components/Forms/PlaqueFrom";
import { RangeDatePicker } from "@/components/Forms/RangeDatePicker";
import { currency } from "@/utils/currency";
import { getPlaque, sendOrderPlaque } from "@/services/plaque";
import { unmaskText } from "@/utils/unmaskText";

interface IPlaques {
  id: string;
  dateCreated: Date;
  dateUpdated: Date;
  pedidoVenda: string;
  pedidoVendaClienteNome: string;
  pedidoVendaNumero: number;
  pedidoVendaData: Date;
  valorAbatido: number;
  formaPagamento: string;
  formaPagamentoNome: string;
  dataRecebimento: Date;
  valorTotal: number;
  valorEmAbertoAnterior: number;
  valorEmAbertoAtual: number;
}

interface PlaqueProps {
  clients: IClient[];
  orders: IOrder[];
  plaques: IPlaques[];
}

interface RangeDate {
  startDate: Date | null;
  endDate: Date | null;
}

export function Plaque({ clients, plaques, orders }: PlaqueProps) {
  const [client, setClient] = useState({ value: "", label: "" });

  const [ordersByClient, setOrdersByClient] = useState<IOrder[] | []>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const [rangeDate, setRangeDate] = useState<RangeDate>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const { control, register, watch, reset, handleSubmit, formState, setValue } =
    useFormContext();

  const hasErrors = formState.isValid;

  const currentClient = watch("cliente") as any;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Número",
        accessor: "numero",
      },
      {
        Header: "Cliente",
        accessor: "clienteNome",
      },
      {
        Header: "Valor total",
        accessor: "valorTotal",
        Cell: ({ value }) => currency(value),
      },
      {
        Header: "Data",
        accessor: "dateCreated",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Total a receber",
        accessor: "valorEmAbertoAtual",
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

  async function loadOrdersByClient() {
    if (client.value === "") {
      toast.warning("Você deve selecionar um cliente antes de continuar.");

      return;
    }

    try {
      setIsLoadingOrders(true);

      const response = await getOrderByClient(client.value);

      setOrdersByClient(response);
      setIsLoadingOrders(false);
    } catch (error) {
      setIsLoadingOrders(false);
      toast.error("Erro ao carrregar placas deste pedido.");
    }
  }

  async function loadOpenValueOrders(id: string) {
    try {
      let response = await getPlaque(id);

      setValue("valorEmAbertoAtual", currency(response[0]?.valorEmAbertoAtual));
      setValue("valorTotal", currency(response[0]?.valorTotal));
    } catch (error) {
      toast.error("Erro ao carregar as informações deste pedido.");
      onClose();
      return;
    }
  }

  function rangeFilter({ startDate, endDate }: RangeDate) {
    setRangeDate({
      startDate,
      endDate,
    });
  }

  async function onSubmit(data: any) {
    try {
      const formattedData = {
        pedidoVenda: data?.id,
        valorAbatido: Number(unmaskText(data?.valorAbatido)) || 0,
        formaPagamento: data?.formaPagamento?.value,
        dataRecebimento: data?.dataRecebimento,
      };

      await sendOrderPlaque(formattedData);
      toast.success("Pedido editado com sucesso!.");
      loadOrdersByClient();
      onClose();
      reset({});
    } catch (error) {
      toast.error("Erro ao editar pedido!.");
      onClose();
      reset({});
      throw new Error("Erro ao editar pedido!.");
    }
  }

  const renderFormEditModal = () => {
    return (
      <ModalDialog
        maxWidth="60%"
        textAction="Editar"
        isOpen={isOpen}
        onClose={() => {
          onClose();
          reset({});
        }}
        onAction={() => {
          handleSubmit(onSubmit)();

          if (hasErrors) {
            onClose();
            reset({});
          }
        }}
      >
        <PlaqueForm />
      </ModalDialog>
    );
  };

  return (
    <Box w="100%" flex={1}>
      <Flex justifyContent="space-between" mb={8}>
        <Heading as="h3" fontSize={26}>
          Baixa de pedidos
        </Heading>
      </Flex>

      <Card bg="whiteAlpha.600" p={5}>
        <Flex w="100%" mb={10} alignItems="center" gap={5}>
          <Box w="25%" mt={4}>
            <FormLabel color="gray.500" fontWeight="bold">
              Cliente:
            </FormLabel>
            <AsyncSelect
              control={control}
              loadOptions={clientOptions}
              value={currentClient}
              onChangeOption={setClient}
              {...register("cliente")}
            />
          </Box>
          <Box mt={12}>
            <RangeDatePicker getRangeDate={rangeFilter} noSearch={true} />
          </Box>
          <Button
            mt={10}
            fontSize={15}
            bg="pink.300"
            color="gray.50"
            _hover={{
              bg: "pink.400",
            }}
            onClick={() => loadOrdersByClient()}
          >
            BUSCAR
          </Button>
        </Flex>

        <DataTable
          isLoading={isLoadingOrders}
          columns={columns}
          data={ordersByClient}
          onRowEdit={(row) => {
            Object.keys(row).forEach((key: any) => {
              return setValue(key, row[key]);
            });

            loadOpenValueOrders(row.id);
            onOpen();
          }}
        />

        {renderFormEditModal()}
      </Card>
    </Box>
  );
}
