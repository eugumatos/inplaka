import { ModalDialog } from "@/components/Modals";
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { IClient } from "@/domains/client";
import { IOrder } from "@/domains/order";
import { getOrderByClient, updatePlaques } from "@/services/order";
import {
  getAllPlaques,
  getPlaqueByClientDate,
  getPlaqueByDate,
} from "@/services/plaque";
import { formatDate } from "@/utils/formatDate";
import { format } from "date-fns";

import {
  Box,
  Button,
  Card,
  Flex,
  FormLabel,
  Heading,
  Tooltip,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { PiBroomBold } from "react-icons/pi";
import { useMemo, useState, useRef } from "react";

import { DataTable } from "@/components/Table";
import { useForm, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

import { Column } from "react-table";

import { PlaqueFormData } from "@/schemas/PlaqueSchemaValidation";
import { PlaqueForm } from "@/components/Forms/PlaqueFrom";
import { RangeDatePicker } from "@/components/Forms/RangeDatePicker";
import { currency } from "@/utils/currency";
import { getPlaque, sendOrderPlaque } from "@/services/plaque";
import { unmaskText } from "@/utils/unmaskText";
import { compareDesc, parseISO } from "date-fns";

interface IPlaques {
  id: string;
  numero: string;
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
  plaques: IPlaques[];
}

interface RangeDate {
  startDate: Date | null;
  endDate: Date | null;
}

export function Plaque({ clients, plaques }: PlaqueProps) {
  const rangePickerRef = useRef<{ resetDates: () => void }>(null);

  const initialValueClient = { value: "", label: "" };
  const [client, setClient] = useState(initialValueClient);

  const [ordersByClient, setOrdersByClient] = useState<IPlaques[] | []>(() => {
    if (plaques.length > 0) {
      return plaques;
    }

    return [];
  });
  const [isLoadingOrdersByClient, setIsLoadingOrdersByClient] = useState(false);

  const [orders, setOrders] = useState<IPlaques[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<IOrder>({} as IOrder);

  const [rangeDate, setRangeDate] = useState<RangeDate>({
    startDate: null,
    endDate: null,
  });

  const { control, register, watch, reset, handleSubmit, formState, setValue } =
    useFormContext();

  const hasErrors = formState.isValid;

  const currentClient = watch("cliente") as any;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const disclosureOrder = useDisclosure();

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
        Header: "Valor em aberto",
        accessor: "valorEmAbertoAtual",
        Cell: ({ value }) => currency(value),
      },
    ],
    []
  );

  const columnOrders = useMemo(
    (): Column[] => [
      {
        Header: "Forma pagamento",
        accessor: "formaPagamentoNome",
      },
      {
        Header: "Valor abatido",
        accessor: "valorAbatido",
        Cell: ({ value }) => (value === 0 ? "" : currency(value)),
      },
      {
        Header: "Data recebimento",
        accessor: "dataRecebimento",
        Cell: ({ value }) => formatDate(value),
      },
    ],
    []
  );

  const handleResetClick = () => {
    if (rangePickerRef.current) {
      rangePickerRef.current.resetDates();
    }

    setValue("cliente", initialValueClient);
    setClient(initialValueClient);
  };

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

  async function loadOrders() {
    try {
      setIsLoadingOrders(true);
      const response = await getAllPlaques();

      setOrdersByClient(response as any);
      setIsLoadingOrders(false);
    } catch (error) {
      setIsLoadingOrders(false);

      toast.error("Erro ao carregar pedidos");
    }
  }

  async function loadOrdersByClient() {
    try {
      const formattedStart = rangeDate?.startDate
        ? format(rangeDate.startDate, "yyyy-MM-dd")
        : null;
      const formattedEnd = rangeDate?.endDate
        ? format(rangeDate.endDate, "yyyy-MM-dd")
        : null;

      setIsLoadingOrdersByClient(true);
      let response = [];

      if (client?.value && formattedStart && formattedEnd) {
        // Fetch plaques by client and date range
        response = await getPlaqueByClientDate(
          client.value,
          formattedStart,
          formattedEnd
        );
      } else if (formattedStart && formattedEnd) {
        // Fetch plaques by date range
        response = await getPlaqueByDate(formattedStart, formattedEnd);
      } else if (client?.value) {
        // Fetch orders by client
        response = await getOrderByClient(client.value);
      } else {
        // Fetch all plaques
        response = await getAllPlaques();
      }

      setOrdersByClient(response);
    } catch (error) {
      toast.error("Erro ao carregar placas deste pedido.");
    } finally {
      setIsLoadingOrdersByClient(false);
    }
  }

  async function loadOpenValueOrders(row: IPlaques) {
    try {
      setIsLoadingOrders(true);

      let response = await getPlaque(row?.id);

      const sortedArray = response.sort((a: IPlaques, b: IPlaques) => {
        const dateA = parseISO(String(a.dataRecebimento));
        const dateB = parseISO(String(b.dataRecebimento));

        return compareDesc(dateA, dateB);
      });

      setOrders(sortedArray);
      setIsLoadingOrders(false);
    } catch (error) {
      toast.error("Erro ao carregar as informações deste pedido.");
      setIsLoadingOrders(false);
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
        pedidoVenda: currentOrder?.id,
        valorAbatido: Number(unmaskText(data?.valorAbatido)) || 0,
        formaPagamento: data?.formaPagamento?.value,
        conta: data?.conta.value,
        dataRecebimento: data?.dataRecebimento,
      };

      await sendOrderPlaque(formattedData);
      toast.success("Pedido editado com sucesso!.");
      loadOrders();
      setCurrentOrder({} as IOrder);
      disclosureOrder.onClose();
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
        textAction="Criar lançamento"
        isOpen={isOpen}
        onClose={onClose}
        onAction={() => {
          onClose();
          reset({});

          const totalAbatido = orders
            .map((o) => o.valorAbatido)
            .filter((value) => typeof value === "number")
            .reduce((sum, value) => sum + (value as number), 0);

          const totalAberto =
            currentOrder?.valorTotal &&
            currentOrder?.valorTotal - totalAbatido <= currentOrder?.valorTotal
              ? currentOrder?.valorTotal - totalAbatido
              : 0;

          if (totalAberto === 0) {
            toast.warning("Não existe valores em abertos para este pedido!");

            return;
          }

          setValue("valorEmAbertoAtual", currency(totalAberto ?? ""));

          setValue(
            "valorTotal",
            currency(Number(currentOrder?.valorTotal) ?? "")
          );

          disclosureOrder.onOpen();
        }}
      >
        <Heading size="md">Pedidos a receber: {currentOrder?.numero}</Heading>
        <Box mt={4}>
          <DataTable
            isLoading={isLoadingOrders}
            columns={columnOrders}
            data={orders}
          />
        </Box>
      </ModalDialog>
    );
  };

  const renderCreateLaunchModal = () => {
    return (
      <ModalDialog
        maxWidth="60%"
        textAction="Criar"
        isOpen={disclosureOrder.isOpen}
        onClose={disclosureOrder.onClose}
        onAction={() => {
          handleSubmit(onSubmit)();
          if (hasErrors) {
            disclosureOrder.onClose();
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
            <RangeDatePicker
              ref={rangePickerRef}
              getRangeDate={() => {}}
              onChangeDateStart={(start) =>
                setRangeDate({ ...rangeDate, startDate: start })
              }
              onChangeDateEnd={(end) =>
                setRangeDate({ ...rangeDate, endDate: end })
              }
              noSearch={true}
            />
          </Box>
          <Box mt="auto">
            <Tooltip label="Limpar filtro">
              <IconButton
                aria-label="Limpar filtro"
                bg="teal.400"
                icon={<PiBroomBold color="#fff" />}
                onClick={() => {
                  handleResetClick();
                }}
                _hover={{
                  bg: "teal.500",
                }}
              />
            </Tooltip>
          </Box>
          <Button
            mt="auto"
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
          isLoading={isLoadingOrdersByClient}
          columns={columns}
          data={ordersByClient}
          onRowEdit={(row) => {
            loadOpenValueOrders(row);
            setCurrentOrder(row);
            onOpen();
          }}
        />

        {renderFormEditModal()}
        {renderCreateLaunchModal()}
      </Card>
    </Box>
  );
}
