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
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { PopoverPlaqueForm } from "@/containers/Order/PopoverPlaqueForm";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { getClients } from "@/services/clients";
import { getSellers } from "@/services/seller";
import { useFormContext } from "react-hook-form";
import { IClient } from "@/domains/client";
import { ISeller } from "@/domains/seller";
import { IService } from "@/domains/service";
import { IProduct } from "@/domains/product";
import { getFormPayments } from "@/services/form-payment";
import { IFormPayment } from "@/domains/form-payment";
import { DataTable } from "@/components/Table";
import { Input } from "@/components/Input";
import { InputQuantity } from "@/components/Input/InputQuantity";
import { filterText } from "@/utils/filterText";
import { currency } from "@/utils/currency";
import { toast } from "react-toastify";
import { getProducts } from "@/services/product";
import { getServices } from "@/services/service";

export function OrderForm() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<OrderFormData>();

  const containerTotalRef = useRef<null | HTMLDivElement>(null);

  const [products, setProducts] = useState<IProduct[] | []>([]);
  const [services, setServices] = useState<IService[] | []>([]);

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

  async function loadClientOptions(value: string) {
    try {
      const clients = await getClients();
      const options = clients
        .map((client) => ({
          value: client.id,
          label: client.apelido,
        }))
        .filter((item) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar clientes");

      return [];
    }
  }

  async function loadSellerOptions(value: string) {
    try {
      const sellers = await getSellers();
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

  async function loadFormPaymentOptions(value: string) {
    try {
      const formPayments = await getFormPayments();
      const options = formPayments
        .map((formPayment) => ({
          value: formPayment.id,
          label: formPayment.descricao,
        }))
        .filter((item: { label: string }) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar vendedores");

      return [];
    }
  }

  useEffect(() => {
    async function getDataTable() {
      try {
        const products = await getProducts();
        const services = await getServices();

        setProducts(products);
        setServices(services);
      } catch (error) {
        toast.warning("Erro ao listar produtos e serviços");
      }
    }

    getDataTable();
  }, []);

  return (
    <form>
      <Box h="94vh" mt={2}>
        <Heading size="md">Dados do pedido</Heading>

        <Flex h="100%" direction="column" justify="space-between">
          <HStack mt={5} gap={4} alignItems="center">
            <Box flex={1}>
              <FormLabel>Cliente:</FormLabel>
              <AsyncSelect name="cliente" loadOptions={loadClientOptions} />
            </Box>
            <Box flex={1}>
              <FormLabel>Vendedor:</FormLabel>
              <AsyncSelect name="vendedor" loadOptions={loadSellerOptions} />
            </Box>
            <Box flex={1}>
              <FormLabel>Forma pagamento:</FormLabel>
              <AsyncSelect
                name="formaPagamento"
                loadOptions={loadFormPaymentOptions}
              />
            </Box>
          </HStack>

          <Tabs mt={5} isManual variant="enclosed">
            <TabList>
              <Tab>Produtos</Tab>
              <Tab>Serviços</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <DataTable
                  columns={columns}
                  data={products}
                  itemsPerPage={5}
                  customnAction={() => (
                    <Flex gap={4} justify="flex-end">
                      <InputQuantity maxW="50%" />
                      <PopoverPlaqueForm />
                    </Flex>
                  )}
                />
              </TabPanel>
              <TabPanel>
                <DataTable
                  columns={columns}
                  data={services}
                  itemsPerPage={5}
                  customnAction={() => <InputQuantity maxW="50%" />}
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
              </Flex>
              <Flex gap={2}>
                <Icon as={RiStoreLine} boxSize={5} />
                <Text size="md" fontWeight="bold">
                  Vendedor:
                </Text>
              </Flex>
              <Flex gap={2}>
                <Icon as={RiBankCard2Line} boxSize={5} />
                <Text size="md" fontWeight="bold">
                  Forma de pagamento:
                </Text>
                <Text size="md"></Text>
              </Flex>
            </VStack>
          </Box>
        </Flex>

        <Box w="100%">
          <Text size="md">Subtotal:</Text>
          <Text size="md">Frete:</Text>
          <Text fontSize={20} fontWeight="bold" my={2}>
            {" "}
            Total da venda:
          </Text>
          <InputGroup>
            {/* eslint-disable-next-line react/no-children-prop */}
            <InputLeftAddon children="R$" />
            <Input type="number" name="desconto" placeholder="Ex: 5000" />
          </InputGroup>
          <Button
            mt={4}
            w="100%"
            type="submit"
            color="gray.50"
            bg="green.400"
            _hover={{
              bg: "green.500",
            }}
          >
            CONCLUIR
          </Button>
        </Box>
      </Box>
    </form>
  );
}
