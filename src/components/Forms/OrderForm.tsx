import { Flex, Heading } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { AsyncSelect } from "@/components/Select/AsyncSelect";

export function OrderForm() {
  const { control } = useFormContext();

  return (
    <form>
      <Flex h="200vh" flexDirection="column" gap={4}>
        <Heading size="md">Dados do pedido</Heading>

        <Flex>
          <AsyncSelect
            control={control}
            loadOptions={clientOptions}
            value={currentClient}
            error={errors.cliente?.label}
            {...register("cliente")}
          />
        </Flex>
      </Flex>
    </form>
  );
}
