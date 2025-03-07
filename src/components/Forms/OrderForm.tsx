import { Input } from "@/components/Input";
import { InputCurrency } from "@/components/Input/InputCurrency";
import { InputQuantity } from "@/components/Input/InputQuantity";
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { DataTable } from "@/components/Table";
import { FinishingModal } from "@/containers/Order/FinishingModal";
import { useOrderForm } from "@/containers/Order/hooks/useOrderForm";
import { PopoverPlaqueForm } from "@/containers/Order/PopoverPlaqueForm";
import { useOrder } from "@/contexts/OrderContext";
import { useDebounce } from "@/hooks/useDebounce";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { currency as currencyFormat } from "@/utils/currency";
import { filterText } from "@/utils/filterText";
import { formatDate } from "@/utils/formatDate";
import { unmaskText } from "@/utils/unmaskText";
import { upper } from "@/utils/upper";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Icon,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  RiArrowDownSLine,
  RiBox3Line,
  RiCloseFill,
  RiDraftLine,
  RiPrinterLine,
  RiStoreLine,
  RiUser3Line,
} from "react-icons/ri";
import { Column } from "react-table";
import { toast } from "react-toastify";

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

  const { setterOrder } = useOrder();

  const containerTotalRef = useRef<null | HTMLDivElement>(null);

  const currentClient = watch("cliente") as any;

  const {
    isLoading,
    products,
    clientOptions,
    sellerOptions,
    registeredPlaques,
    updateProductAmount,
    updateProductPlaque,
    removeProductPlaque,
    calculateTotal,
    seekSelectedClientOption,
    seekSelectedSellerOption,
    formatImportData,
  } = useOrderForm({ id, clientId: currentClient?.value });

  const { isOpen, onOpen, onClose } = useDisclosure();

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
      //   placaQuitada as Column,
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
        accessor: "valor_venda_cliente",
        Cell: ({ value }) => currencyFormat(value),
      },
    ],
    []
  );

  function onScrollToTotal() {
    containerTotalRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const renderFinishingOrderModal = () => {
    return <FinishingModal isOpen={isOpen} onClose={onClose} />;
  };

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
    formValues.total = total + (Number(unmaskText(servicoValue)) || 0);

    if (formValues.produtos.length === 0) {
      toast.warning(
        "É necessário adicionar pelo menos um produto antes de realizar um pedido."
      );

      setValue("status", undefined);
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

      setValue("status", undefined);

      return;
    }

    let findPlaquesNotChecked = false;

    formValues.produtos.forEach((p) => {
      const checkPlaques = p.placas?.some(
        (placa) => placa.placaQuitada === false
      );

      if (checkPlaques) findPlaquesNotChecked = checkPlaques;
    });

    if (formValues.status === "ABERTO" && !findPlaquesNotChecked) {
      formValues.status = "QUITADO";
    }

    if (formValues.servicoDescription && formValues.servicoValue) {
      if (
        formValues.servicoDescription.length > 0 &&
        +unmaskText(formValues.servicoValue) > 0
      ) {
        formValues.servicos = [
          {
            servico: "5861b755-4fcd-4fd3-a4fe-2d8ceb619880",
            quantidade: 1,
            descricao: formValues.servicoDescription,
            valorUnitario: Number(unmaskText(formValues.servicoValue || "")),
            valorTotal: Number(unmaskText(formValues.servicoValue || "")),
            observacao: "",
          },
        ];
      }
    } else {
      formValues.servicos = [];
    }

    delete formValues.servicoDescription,
      delete formValues.servicoValue,
      setValue("produtos", formValues.produtos);
    setValue("total", formValues.total);

    onSubmit(formValues);
  }

  const handlePrint = () => {
    const formValues = getValues();

    const formattedProducts = [] as any;

    products.forEach((product) => {
      if (product.quantidade > 0) {
        product.placas &&
          product.placas.forEach((placa) => {
            formattedProducts.push({
              produto: product.id,
              quantidade: 1,
              placa: placa.descricao,
              chassi: placa?.chassi,
              marca: placa?.marca,
              modelo: placa?.modelo,
              cor: placa?.cor,
              localEmplacamento: placa?.localEmplacamento,
              placaQuitada: placa.placaQuitada,
              descricao: product.descricao,
              valorUnitario: product.valor_venda,
            });
          });
      }
    });

    setterOrder({
      cliente: formValues.cliente.value,
      dateCreated: formatDate(formValues.dateCreated || ""),
      produtos: formattedProducts,
      numero: formValues.numero,
      total: total - Number(formValues.valorDesconto),
    });
  };

  const servicoDescription = watch("servicoDescription") as any;
  const servicoValue = watch("servicoValue") as any;

  const currentSeller = watch("vendedor") as any;

  const { status } = getValues();

  const isEditable = status === "RASCUNHO" || status === undefined;

  useEffect(() => {
    if (registeredPlaques) setAllPlaques(registeredPlaques);
  }, [registeredPlaques]);

  useEffect(() => {
    const servicoFormattedValue = unmaskText(servicoValue);
    if (Number(servicoFormattedValue) > 0) {
      setTotalValue(total + Number(servicoFormattedValue));
    }
  }, [total, servicoValue, id]);

  return (
    <form>
      <Flex h="200vh" flexDirection="column" gap={4}>
        <Box flex={1}>
          <Heading size="md">Dados do pedido</Heading>

          <Flex direction="column" gap={4} justify="space-between">
            <HStack mt={5} gap={4} alignItems="center">
              <Box flex={1}>
                <FormLabel>Cliente:</FormLabel>
                <AsyncSelect
                  isDisabled={!isEditable}
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
                  isDisabled={!isEditable}
                  control={control}
                  value={currentSeller}
                  loadOptions={sellerOptions}
                  error={errors.vendedor?.label}
                  {...register("vendedor")}
                />
              </Box>
              {/*
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
              */}
            </HStack>

            <Tabs isManual variant="enclosed">
              <TabList>
                <Tab>Produtos</Tab>
                <Tab>Outros</Tab>
                <Tab hidden={!id}>Placas</Tab>
              </TabList>
              <TabPanels mt={5}>
                <TabPanel p={0}>
                  <DataTable
                    isLoading={isLoading}
                    customnButtonTable={() =>
                      id ? (
                        <Tooltip label="Imprimir">
                          <IconButton
                            aria-label="Print"
                            bg="cyan.500"
                            onClick={() => {
                              handlePrint();
                              onOpen();
                            }}
                            icon={<RiPrinterLine color="#fff" />}
                            _hover={{
                              bg: "cyan.400",
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <></>
                      )
                    }
                    showGeneratedData={!!id}
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
                          forceDisabled={!isEditable}
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
                            isDisabled={+row.unidade <= 0 || !isEditable}
                          />
                        </Box>
                      </Flex>
                    )}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <Flex gap={4} alignItems="center">
                    <Input
                      mt={4}
                      label="Descrição"
                      isDisabled={!isEditable}
                      placeholder="Ex: Frete"
                      {...register("servicoDescription")}
                    />

                    <InputCurrency
                      mt={2}
                      label="Valor venda"
                      name="servicoValue"
                      isDisabled={!isEditable}
                      placeholder="R$ 500,00"
                      control={control}
                    />
                  </Flex>
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

        <Box flex={1} ref={containerTotalRef}>
          <Flex h="100%" direction="column" gap={2} align="space-between">
            <Flex w="100%" direction="column" align="space-between">
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
                    <Icon as={RiBox3Line} boxSize={5} />
                    <Text size="md" fontWeight="bold">
                      Outros:
                    </Text>
                    <Text size="md">{servicoDescription}</Text>
                  </Flex>
                  {/*
                  <Flex gap={2}>
                    <Icon as={RiBankCard2Line} boxSize={5} />
                    <Text size="md" fontWeight="bold">
                      Forma de pagamento:
                    </Text>
                    <Text size="md">{currentPaymentOption?.label}</Text>
                  </Flex>
                  */}
                </VStack>
              </Box>
            </Flex>

            <Box mt={5}>
              {products
                .filter((product) => product.quantidade > 0)
                .map((product) => (
                  <Flex key={product.id} justify="flex-start" gap={2}>
                    <Flex gap={1}>
                      <Text fontSize="sm" fontWeight="bold">
                        {product.quantidade}x
                      </Text>
                      <Text fontSize="sm">{product.descricao}</Text>
                    </Flex>
                  </Flex>
                ))}
            </Box>

            <Box w="100%" mt="auto">
              <Text size="md">
                Subtotal: {currencyFormat(subTotalProducts)}
              </Text>
              <Text size="md">
                Serviços: {currencyFormat(subTotalServices)}
              </Text>
              <Flex my={2}>
                <Text fontSize={20} fontWeight="bold">
                  {" "}
                  Total da venda:
                </Text>
                <Text ml={2} fontSize={20}>
                  {currencyFormat(
                    total + (Number(unmaskText(servicoValue)) || 0)
                  )}
                </Text>
              </Flex>

              {isEditable && (
                <Flex gap={4} alignItems="center">
                  <Button
                    my={4}
                    w="100%"
                    type="button"
                    color="gray.50"
                    bg="green.400"
                    _hover={{
                      bg: "green.500",
                    }}
                    onClick={() => {
                      setValue("status", "ABERTO");
                      handleSubmit();
                    }}
                  >
                    ABRIR PEDIDO
                  </Button>
                  <Tooltip label="Salvar rascunho">
                    <IconButton
                      aria-label="Draft"
                      icon={<RiDraftLine color="#767171" size={20} />}
                      onClick={() => {
                        setValue("status", "RASCUNHO");
                        handleSubmit();
                      }}
                    />
                  </Tooltip>

                  {status === "RASCUNHO" && (
                    <Tooltip label="Cancelar pedido">
                      <IconButton
                        bg="red.200"
                        aria-label="Cancel"
                        icon={<RiCloseFill size={20} color="#e4e2e2" />}
                        onClick={() => {
                          setValue("status", "CANCELADO");
                          handleSubmit();
                        }}
                      />
                    </Tooltip>
                  )}
                </Flex>
              )}
            </Box>
          </Flex>
        </Box>
      </Flex>

      {renderFinishingOrderModal()}
    </form>
  );
}
