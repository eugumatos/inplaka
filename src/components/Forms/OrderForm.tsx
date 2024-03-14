import { useMemo, useRef, useEffect, useState } from "react";
import {
  Box,
  Divider,
  Flex,
  Heading,
  FormLabel,
  HStack,
  Button,
  VStack,
  Icon,
  Text,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  IconButton,
  Tab,
  Checkbox,
} from "@chakra-ui/react";
import {
  RiArrowDownSLine,
  RiUser3Line,
  RiStoreLine,
  RiBankCard2Line,
} from "react-icons/ri";
import { Column } from "react-table";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "@/hooks/useDebounce";
import { Select } from "@/components/Select";
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { PopoverPlaqueForm } from "@/containers/Order/PopoverPlaqueForm";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { DataTable } from "@/components/Table";
import { InputQuantity } from "@/components/Input/InputQuantity";
import { InputCurrency } from "@/components/Input/InputCurrency";
import { filterText } from "@/utils/filterText";
import { currency as currencyFormat } from "@/utils/currency";
import { useOrderForm } from "@/containers/Order/hooks/useOrderForm";
import { toast } from "react-toastify";
import currency from "currency.js";
import { upper } from "@/utils/upper";
import { useOrder } from "@/contexts/OrderContext";

interface IPlaque {
  descricao: string;
  placaQuitada: boolean;
  marca_modelo: string;
  chassi: string;
  localEmplacamento: string;
}

interface OrderFormProps {
  id?: string;
  onSubmit: (order: OrderFormData) => void;
}

export function OrderForm({ id, onSubmit }: OrderFormProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext<OrderFormData>();

  const containerTotalRef = useRef<null | HTMLDivElement>(null);

  const {
    isLoading,
    products,
    services,
    clientOptions,
    sellerOptions,
    paymentOptions,
    registeredPlaques,
    updateProductAmount,
    updateServiceAmount,
    updateProductPlaque,
    removeProductPlaque,
    calculateTotal,
    seekSelectedClientOption,
    seekSelectedSellerOption,
    formatImportData,
  } = useOrderForm({ id });

  const { subTotalProducts, subTotalServices, total } = calculateTotal();

  const [totalValue, setTotalValue] = useState(0);

  const initialDiscountValue = getValues()?.valorDesconto || 0;

  const [discountFormValue, setDiscountFormValue] =
    useState<any>(initialDiscountValue);

  const discount = useDebounce(String(discountFormValue), 500);

  const [allPlaques, setAllPlaques] = useState([] as any);
  const [checkRows, setCheckRows] = useState(false);

  const placaQuitada = useMemo(() => {
    return {
      Header: () => (
        <Checkbox
          size="md"
          onChange={() => {
            setAllPlaques((previousPlaques: any) => {
              const updatedPlaques = previousPlaques.map((item: IPlaque) => {
                return {
                  ...item,
                  placaQuitada: !item.placaQuitada,
                };
              });

              updateProductPlaque(
                "47e6b7ec-dff4-45a5-ad20-d4907a593cbf",
                updatedPlaques
              );

              return updatedPlaques;
            });

            setCheckRows(!checkRows);
          }}
          isChecked={checkRows}
        >
          Placa quitada
        </Checkbox>
      ),
      accessor: "placaQuitada",
      Cell: ({ row }: any) => (
        <Checkbox
          size="md"
          onChange={() => {
            setAllPlaques((previousPlaques: any) => {
              const updatedPlaques = previousPlaques.map((item: IPlaque) => {
                return item.descricao === row.original.descricao
                  ? {
                      ...item,
                      placaQuitada: !item.placaQuitada,
                    }
                  : { ...item };
              });

              updateProductPlaque(
                "47e6b7ec-dff4-45a5-ad20-d4907a593cbf",
                updatedPlaques
              );

              return updatedPlaques;
            });
          }}
          isChecked={row.original.placaQuitada}
        />
      ),
    };
  }, [checkRows, updateProductPlaque]);

  const columnsPlaque = useMemo(
    (): Column[] => [
      placaQuitada as Column,
      {
        Header: "Nome",
        accessor: "descricao",
        Cell: ({ value }) => filterText(upper(value), 55),
      },
    ],
    [placaQuitada]
  );

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Descrição",
        accessor: "descricao",
        Cell: ({ value }) => filterText(upper(value), 20),
      },
      {
        Header: "Valor venda",
        accessor: "valorUnitario",
        Cell: ({ value }) => currencyFormat(value),
      },
    ],
    []
  );

  function onScrollToTotal() {
    containerTotalRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const handleImport = async (parsedData: any) => {
    const formattedData: any = parsedData;

    const client = (await seekSelectedClientOption(
      parsedData[0].cliente
    )) as any;
    const seller = (await seekSelectedSellerOption(
      parsedData[0].vendedor
    )) as any;

    formattedData.cliente = client;
    formattedData.vendedor = seller;

    if (client) {
      setValue("cliente", client);
    }

    if (seller) {
      setValue("vendedor", seller);
    }

    formatImportData(formattedData);
  };

  function handleSubmit() {
    const formValues = getValues();

    formValues.produtos = products.filter((p) => p.quantidade > 0);
    formValues.servicos = services.filter((s) => s.quantidade > 0);
    formValues.desconto = discount;
    formValues.total = total;

    if (formValues.produtos.length === 0 && formValues.servicos.length === 0) {
      toast.warning(
        "É necessário adicionar pelo menos um produto ou serviço antes de realizar um pedido."
      );

      return;
    }

    const filterPlaquesNotFilled = formValues.produtos.filter(
      (p) => p.quantidade !== p.placas?.length
    );

    if (filterPlaquesNotFilled.length > 0) {
      toast.warning(
        `Não foi preenchido o nome de todas as placas referente aos seguintes produtos ("${filterPlaquesNotFilled.map(
          (p) => upper(p.descricao) + " "
        )}"). Por favor verifique e tente novamente.`
      );

      return;
    }

    let findPlaquesNotChecked = false;

    formValues.produtos.forEach((p) => {
      const checkPlaques = p.placas?.some(
        (placa) => placa.placaQuitada === false
      );

      if (checkPlaques) findPlaquesNotChecked = checkPlaques;
    });

    if (formValues.status === "FINALIZADO" && findPlaquesNotChecked) {
      toast.warning(
        "É necessário que todas as placas estejam quitadas antes de finalizar um pedido!."
      );

      return;
    }

    setValue("produtos", formValues.produtos);
    setValue("servicos", formValues.servicos);
    setValue("desconto", formValues.desconto);
    setValue("total", formValues.total);

    onSubmit(formValues);
  }

  const currentClient = watch("cliente") as any;
  const currentSeller = watch("vendedor") as any;
  const currentPaymentOption = watch("formaPagamento") as any;

  const statusOption = watch("status");

  const shouldDisabledOption =
    (!!id && statusOption === "ABERTO") || statusOption === "CANCELADO";

  useEffect(() => {
    if (registeredPlaques) setAllPlaques(registeredPlaques);
  }, [registeredPlaques]);

  useEffect(() => {
    if (total > Number(discount)) {
      setTotalValue(total - Number(discount));
    }
  }, [total, discount, id]);

  return (
    <form>
      <Box h="100vh">
        <Heading size="md">Dados do pedido</Heading>

        <Flex direction="column" gap={4} justify="space-between">
          <HStack mt={5} gap={4} alignItems="center">
            <Box flex={1}>
              <FormLabel>Cliente:</FormLabel>
              <AsyncSelect
                control={control}
                loadOptions={clientOptions}
                value={currentClient}
                error={errors.cliente?.label}
                {...register("cliente")}
              />
            </Box>
            <Box flex={1}>
              <FormLabel>Vendedor:</FormLabel>
              <AsyncSelect
                control={control}
                value={currentSeller}
                loadOptions={sellerOptions}
                error={errors.vendedor?.label}
                {...register("vendedor")}
              />
            </Box>
            <Box flex={1}>
              <FormLabel>Forma pagamento:</FormLabel>
              <AsyncSelect
                control={control}
                value={currentPaymentOption}
                loadOptions={paymentOptions}
                error={errors.formaPagamento?.label}
                {...register("formaPagamento")}
              />
            </Box>
          </HStack>

          <Tabs isManual variant="enclosed">
            <TabList>
              <Tab>Produtos</Tab>
              <Tab>Serviços</Tab>
              <Tab hidden={!id}>Placas</Tab>
            </TabList>
            <TabPanels mt={5}>
              <TabPanel p={0}>
                <DataTable
                  isLoading={isLoading}
                  generatedData={products[0]?.placas}
                  onImport={handleImport}
                  disableImport={!!id}
                  columns={columns}
                  data={products}
                  itemsPerPage={5}
                  customnAction={(row) => (
                    <Flex gap={4} justify="flex-end">
                      <InputQuantity
                        key={row.id}
                        name="produto"
                        maxQ={row.unidade}
                        maxW="50%"
                        forceDisabled={!!id}
                        value={row.quantidade}
                        onChangeQuantity={(value) => {
                          updateProductAmount(row, value);
                        }}
                      />
                      <Box>
                        <PopoverPlaqueForm
                          product={row}
                          updateProductPlaque={updateProductPlaque}
                          removeProductPlaque={removeProductPlaque}
                          isDisabled={+row.unidade <= 0 || !!id}
                        />
                      </Box>
                    </Flex>
                  )}
                />
              </TabPanel>
              <TabPanel p={0}>
                <DataTable
                  isLoading={isLoading}
                  columns={columns}
                  data={services}
                  itemsPerPage={5}
                  customnAction={(row) => (
                    <InputQuantity
                      key={row.id}
                      name="servico"
                      forceDisabled={!!id}
                      maxQ={row.unidade}
                      value={row.quantidade}
                      maxW="50%"
                      onChangeQuantity={(value) => {
                        updateServiceAmount(row, value);
                      }}
                    />
                  )}
                />
              </TabPanel>
              <TabPanel hidden={!id}>
                <DataTable columns={columnsPlaque} data={allPlaques} />
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Button
            mt="auto"
            ml="auto"
            type="button"
            w="40%"
            bg="transaprent"
            border="1px"
            onClick={onScrollToTotal}
            rightIcon={<RiArrowDownSLine size={20} />}
          >
            Ir para fechamento do pedido
          </Button>
        </Flex>
      </Box>

      <Divider my={3} orientation="horizontal" />

      <Box ref={containerTotalRef} h="100vh">
        <Flex h="78%" direction="column" align="space-between">
          <Box>
            <Heading size="lg">Total</Heading>
            <VStack mt={10} spacing={3} align="stretch" justify="center">
              <Flex gap={2}>
                <Icon as={RiUser3Line} boxSize={5} />
                <Text size="md" fontWeight="bold">
                  Cliente:
                </Text>
                <Text size="md">{currentClient?.label}</Text>
              </Flex>
              <Flex gap={2}>
                <Icon as={RiStoreLine} boxSize={5} />
                <Text size="md" fontWeight="bold">
                  Vendedor:
                </Text>
                <Text size="md">{currentSeller?.label}</Text>
              </Flex>
              <Flex gap={2}>
                <Icon as={RiBankCard2Line} boxSize={5} />
                <Text size="md" fontWeight="bold">
                  Forma de pagamento:
                </Text>
                <Text size="md">{currentPaymentOption?.label}</Text>
              </Flex>
            </VStack>
          </Box>
        </Flex>

        {products
          .filter((product) => product.quantidade > 0)
          .map((product) => (
            <Flex key={product.id} justify="flex-start" my={1}>
              <Flex gap={1}>
                <Text fontSize="sm" fontWeight="bold">
                  {product.quantidade}x
                </Text>
                <Text fontSize="sm">{product.descricao}</Text>
              </Flex>
            </Flex>
          ))}

        {services
          .filter((service) => service.quantidade > 0)
          .map((service) => (
            <Flex key={service.id} justify="flex-start" my={1}>
              <Flex gap={1}>
                <Text fontSize="sm" fontWeight="bold">
                  {service.quantidade}x
                </Text>
                <Text fontSize="sm">{service.descricao}</Text>
              </Flex>
            </Flex>
          ))}

        <Box w="100%" mt={4}>
          <Text size="md">Subtotal: {currencyFormat(subTotalProducts)}</Text>
          <Text size="md">Serviços: {currencyFormat(subTotalServices)}</Text>
          <Flex my={2}>
            <Text fontSize={20} fontWeight="bold">
              {" "}
              Total da venda:
            </Text>
            <Text ml={2} fontSize={20}>
              {currencyFormat(totalValue)}
            </Text>
          </Flex>

          <Flex direction="column" flex={1} gap={2}>
            {!id ? (
              <div>
                <Text>Desconto:</Text>
                <InputCurrency
                  mt={2}
                  name="desconto"
                  placeholder="Ex: R$ 100,00"
                  control={control}
                  onChange={(e) =>
                    setDiscountFormValue(currency(e.target.value))
                  }
                />
              </div>
            ) : (
              <Select
                label="Status"
                defaultOption="ATIVO"
                {...register("status")}
              >
                <option value="ABERTO" disabled={shouldDisabledOption}>
                  ABERTO
                </option>
                <option value="FINALIZADO">FINALIZADO</option>
                <option value="CANCELADO">CANCELADO</option>
              </Select>
            )}
          </Flex>

          <Button
            my={4}
            w="100%"
            type="button"
            color="gray.50"
            bg="green.400"
            _hover={{
              bg: "green.500",
            }}
            onClick={handleSubmit}
          >
            CONCLUIR
          </Button>
        </Box>
      </Box>
    </form>
  );
}
