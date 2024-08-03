import {
  Box,
  Heading,
  VStack,
  Flex,
  Text,
  Icon,
  Button,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import {
  RiUser3Line,
  RiStoreLine,
  RiBox3Line,
  RiDraftLine,
  RiCloseFill,
} from "react-icons/ri";
import { useFormContext } from "react-hook-form";
import { useOrderProducts } from "./contexts/OrderProductContext";

import { OrderFormData } from "@/schemas/OrderSchemaValidation";
import { unmaskText } from "@/utils/unmaskText";
import { currency } from "@/utils/currency";
import { useMemo } from "react";

type OrderSummaryProps = {
  onSubmit: () => void;
};

export function OrderSummary({ onSubmit }: OrderSummaryProps) {
  const { watch, setValue } = useFormContext<OrderFormData>();
  const { products } = useOrderProducts();

  const client = watch("cliente")?.label;
  const seller = watch("vendedor")?.label;

  const service = watch("servico");
  const serviceValue = watch("servicoValor");

  const serviceValueFormatted = serviceValue
    ? Number(unmaskText(serviceValue)) || 0
    : 0;

  const existService = service && serviceValueFormatted > 0;

  const summary = useMemo(() => {
    const selectedProducts = products.filter(
      (product) => product.quantidade > 0
    );

    const totalProducts = selectedProducts.reduce((acc, cartItem) => {
      return acc + cartItem.quantidade * Number(cartItem.valor_venda_cliente);
    }, 0);

    const totalServices = existService ? serviceValueFormatted : 0;

    return {
      total: totalProducts + totalServices,
      subTotalProducts: totalProducts,
      subTotalServices: totalServices,
    };
  }, [products, serviceValueFormatted, existService]);

  function handleOrderAction() {
    setValue("valorTotal", summary.subTotalProducts);
    setValue("total", summary.total);

    onSubmit();
  }

  return (
    <Box h="100vh" w="100%" pt={10}>
      <Flex direction="column" h="100%">
        <Box>
          <Heading size="lg">Total</Heading>
          <VStack mt={10} spacing={3} align="stretch" justify="center">
            <Flex gap={2}>
              <Icon as={RiUser3Line} boxSize={5} />
              <Text size="md" fontWeight="bold">
                Cliente:
              </Text>
              <Text size="md">{client}</Text>
            </Flex>
            <Flex gap={2}>
              <Icon as={RiStoreLine} boxSize={5} />
              <Text size="md" fontWeight="bold">
                Vendedor:
              </Text>
              <Text size="md">{seller}</Text>
            </Flex>
            <Flex gap={2}>
              <Icon as={RiBox3Line} boxSize={5} />
              <Text size="md" fontWeight="bold">
                Outros:
              </Text>
              <Text size="md">{existService && service}</Text>
            </Flex>
          </VStack>
        </Box>

        <Box mt="auto">
          <VStack spacing={2} align="stretch" justify="center">
            <Text size="md">
              Subtotal: {currency(summary.subTotalProducts)}
            </Text>
            <Text size="md">Outros: {currency(summary.subTotalServices)}</Text>
            <Flex>
              <Text fontSize={20} fontWeight="bold">
                Total da venda:
              </Text>
              <Text ml={2} fontSize={20}>
                {currency(summary.total)}
              </Text>
            </Flex>

            <Flex gap={3} alignItems="center">
              <Button
                my={2}
                w="100%"
                type="button"
                color="gray.50"
                bg="green.400"
                _hover={{
                  bg: "green.500",
                }}
                onClick={() => {
                  setValue("status", "ABERTO");
                  handleOrderAction();
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
                    handleOrderAction();
                  }}
                />
              </Tooltip>

              <Tooltip label="Cancelar pedido">
                <IconButton
                  bg="red.200"
                  aria-label="Cancel"
                  icon={<RiCloseFill size={20} color="#e4e2e2" />}
                  onClick={() => {
                    setValue("status", "CANCELADO");
                    handleOrderAction();
                  }}
                />
              </Tooltip>
            </Flex>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
