import { useMemo, useRef, useEffect, useState, FormEventHandler } from "react";
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
  InputGroup,
  InputLeftAddon,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
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
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { PopoverPlaqueForm } from "@/containers/Order/PopoverPlaqueForm";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { DataTable } from "@/components/Table";
import { Input } from "@/components/Input";
import { InputQuantity } from "@/components/Input/InputQuantity";
import { filterText } from "@/utils/filterText";
import { currency } from "@/utils/currency";
import { useOrderForm } from "@/containers/Order/hooks/useOrderForm";
import { toast } from "react-toastify";
import { IProduct } from "@/domains/product";

interface OrderFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function OrderForm({ onSubmit }: OrderFormProps) {
  const {
    control,
    register,
    watch,
    trigger,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<OrderFormData>();

  const containerTotalRef = useRef<null | HTMLDivElement>(null);

  const {
    products,
    services,
    loadServicesAndProducts,
    clientOptions,
    sellerOptions,
    paymentOptions,
    updateProductAmount,
    updateServiceAmount,
    updateProductPlaque,
    removeProductPlaque,
    calculateTotal,
  } = useOrderForm();

  const clientValue = watch<any>("cliente")?.label || "";
  const sellerValue = watch<any>("vendedor")?.label || "";
  const paymentFormValue = watch<any>("formaPagamento")?.label || "";

  const { subTotalProducts, subTotalServices, total } = calculateTotal();

  const [totalValue, setTotalValue] = useState(0);
  const [discountFormValue, setDiscountFormValue] = useState(0);

  const discount = useDebounce(String(discountFormValue), 500);

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Descrição",
        accessor: "descricao",
        Cell: ({ value }) => filterText(value, 20),
      },
      {
        Header: "Valor venda",
        accessor: "valor_venda",
        Cell: ({ value }) => currency(value),
      },
    ],
    []
  );

  const onScrollToTotal = () => {
    containerTotalRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function handleSubmit() {
    const isValid = await trigger();

    if (!isValid) return;

    const formValues = getValues();

    const formattedValues = Object.assign(formValues, {
      cliente: formValues.cliente?.value,
      vendedor: formValues.cliente?.value,
      formaPagamento: formValues.cliente?.value,
      produtos: products
        .filter((p) => p.quantidade > 0)
        .map((p: IProduct) => {
          return {
            ...p,
            placa: JSON.stringify(p.placas),
          };
        }),
      services: services.filter((s) => s.quantidade > 0),
      valorPedido: total,
      valorDesconto: discountFormValue,
      percentualDesconto: discountFormValue,
      valorTotal: total,
      status: "ABERTO",
    });

    onSubmit(formattedValues);
  }

  useEffect(() => {
    if (total > Number(discount)) {
      setTotalValue(total - Number(discount));
    }
  }, [total, discount]);

  useEffect(() => {
    async function getDataTable() {
      try {
        await loadServicesAndProducts();
      } catch (error) {
        toast.warning("Erro ao listar produtos e serviços");
      }
    }

    getDataTable();
  }, [loadServicesAndProducts]);

  return (
    <form>
      <Box h="91vh" mt={2}>
        <Heading size="md">Dados do pedido</Heading>

        <Flex h="100%" direction="column" justify="space-between">
          <HStack mt={2} gap={4} alignItems="center">
            <Box flex={1}>
              <FormLabel>Cliente:</FormLabel>
              <AsyncSelect
                control={control}
                loadOptions={clientOptions}
                name="cliente"
              />
            </Box>
            <Box flex={1}>
              <FormLabel>Vendedor:</FormLabel>
              <AsyncSelect
                control={control}
                loadOptions={sellerOptions}
                name="vendedor"
              />
            </Box>
            <Box flex={1}>
              <FormLabel>Forma pagamento:</FormLabel>
              <AsyncSelect
                control={control}
                loadOptions={paymentOptions}
                name="formaPagamento"
              />
            </Box>
          </HStack>

          <Tabs mt={3} isManual variant="enclosed">
            <TabList>
              <Tab>Produtos</Tab>
              <Tab>Serviços</Tab>
            </TabList>
            <TabPanels mt={2}>
              <TabPanel p={0}>
                <DataTable
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
                          isDisabled={+row.unidade <= 0}
                        />
                      </Box>
                    </Flex>
                  )}
                />
              </TabPanel>
              <TabPanel p={0}>
                <DataTable
                  columns={columns}
                  data={services}
                  itemsPerPage={5}
                  customnAction={(row) => (
                    <InputQuantity
                      key={row.id}
                      name="servico"
                      maxQ={row.unidade}
                      maxW="50%"
                      onChangeQuantity={(value) => {
                        updateServiceAmount(row, value);
                      }}
                    />
                  )}
                />
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
          <Box mt={10}>
            <Heading size="lg">Total</Heading>
            <VStack mt={10} spacing={3} align="stretch" justify="center">
              <Flex gap={2}>
                <Icon as={RiUser3Line} boxSize={5} />
                <Text size="md" fontWeight="bold">
                  Cliente:
                </Text>
                <Text size="md">{clientValue}</Text>
              </Flex>
              <Flex gap={2}>
                <Icon as={RiStoreLine} boxSize={5} />
                <Text size="md" fontWeight="bold">
                  Vendedor:
                </Text>
                <Text size="md">{sellerValue}</Text>
              </Flex>
              <Flex gap={2}>
                <Icon as={RiBankCard2Line} boxSize={5} />
                <Text size="md" fontWeight="bold">
                  Forma de pagamento:
                </Text>
                <Text size="md">{paymentFormValue}</Text>
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
          <Text size="md">Subtotal: {currency(subTotalProducts)}</Text>
          <Text size="md">Serviços: {currency(subTotalServices)}</Text>
          <Flex my={2}>
            <Text fontSize={20} fontWeight="bold">
              {" "}
              Total da venda:
            </Text>
            <Text ml={2} fontSize={20}>
              {currency(totalValue)}
            </Text>
          </Flex>
          <InputGroup>
            {/* eslint-disable-next-line react/no-children-prop */}
            <InputLeftAddon children="R$" />
            <Input
              type="number"
              placeholder="Ex: 5000"
              value={discountFormValue === 0 ? "" : discountFormValue}
              {...register("desconto", {
                valueAsNumber: true,
                onChange: (e) => {
                  setDiscountFormValue(e.target.value);
                },
              })}
            />
          </InputGroup>
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
