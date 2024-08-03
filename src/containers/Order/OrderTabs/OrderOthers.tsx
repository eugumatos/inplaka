import { Flex } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

import { OrderFormData } from "@/schemas/OrderSchemaValidation";

import { Input } from "@/components/Input";
import { InputCurrency } from "@/components/Input/InputCurrency";

export function OrderOthers() {
  const { control, register } = useFormContext<OrderFormData>();

  return (
    <Flex gap={4} alignItems="center">
      <Input
        mt={4}
        label="Descrição"
        placeholder="Ex: Frete"
        {...register("servico")}
      />

      <InputCurrency
        mt={2}
        name="servicoValor"
        label="Valor venda"
        placeholder="R$ 500,00"
        control={control}
      />
    </Flex>
  );
}
