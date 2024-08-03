import { Flex, Heading, Box, FormLabel } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

import { getClients } from "@/services/clients";
import { getSellers } from "@/services/seller";

import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { OrderFormData } from "@/schemas/OrderSchemaValidation";

export function OrderForm() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<OrderFormData>();

  const clientOptions = async (value: string) => {
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
  };

  const sellerOptions = async (value: string) => {
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
  };

  return (
    <Box>
      <Heading size="md">Dados do pedido</Heading>

      <Flex mt={5} gap={5}>
        <Box flex={1}>
          <FormLabel>Cliente:</FormLabel>
          <AsyncSelect
            control={control}
            loadOptions={clientOptions}
            error={errors.cliente?.label}
            {...register("cliente")}
          />
        </Box>
        <Box flex={1}>
          <FormLabel>Vendedor:</FormLabel>
          <AsyncSelect
            control={control}
            loadOptions={sellerOptions}
            error={errors.vendedor?.label}
            {...register("vendedor")}
          />
        </Box>
      </Flex>
    </Box>
  );
}
