import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { PaymentTermFormData } from "@/schemas/PaymentTermSchemaValidation";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

export function PaymentTermForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PaymentTermFormData>();

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Baixa de pedido</Heading>
        <Flex gap={4} alignItems="center">
          <Input
            mt={4}
            maxW="80%"
            label="Valor em aberto"
            value={130}
            placeholder="Ex: Inplaka"
            {...register("descricao")}
            error={errors.descricao}
            isRequired
            isDisabled
          />
          <Input
            mt={4}
            maxW="80%"
            label="Valor total"
            value={130}
            placeholder="Ex: Inplaka"
            {...register("descricao")}
            error={errors.descricao}
            isRequired
            isDisabled
          />
          <Input
            mt={4}
            maxW="80%"
            label="Valor a ser abatido"
            value={130}
            placeholder="Ex: Inplaka"
            {...register("descricao")}
            error={errors.descricao}
            isRequired
            isDisabled
          />

          <Select
            mt={4}
            maxW="20%"
            label="Conta Bancária"
            defaultOption="ATIVO"
            {...register("status")}
          >
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </Select>
          <Select
            mt={4}
            maxW="20%"
            label="Forma de pagamento"
            defaultOption="ATIVO"
            {...register("status")}
          >
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </Select>
          <Input
            mt={4}
            maxW="80%"
            type="number"
            label="Data recebimento"
            placeholder="Ex: 7"
            maxLength={2}
            {...register("quantidade_parcelas")}
            error={errors.descricao}
            isRequired
          />
        </Flex>
      </Box>
    </form>
  );
}
