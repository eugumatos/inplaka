import { PaymentTermFormData } from "@/schemas/PaymentTermSchemaValidation";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { Input } from "../Input";
import { Select } from "../Select";

export function PaymentTermForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PaymentTermFormData>();

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Dados da condição de pagamento</Heading>
        <Flex gap={4} alignItems="center">
          <Input
            mt={4}
            maxW="80%"
            label="Descrição"
            placeholder="Ex: Inplaka"
            {...register("descricao")}
            error={errors.descricao}
            isRequired
          />

          <Select
            mt={4}
            maxW="20%"
            label="Status"
            defaultOption="ATIVO"
            {...register("status")}
          >
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </Select>
        </Flex>

        <Flex gap={4} alignItems="center">
          <Input
            mt={4}
            maxW="80%"
            type="number"
            label="Quantidade  de parcelas"
            placeholder="Ex: 7"
            maxLength={2}
            {...register("quantidade_parcelas")}
            error={errors.descricao}
            isRequired
          />

          <Input
            mt={4}
            type="number"
            label="Dias entre as parcelas"
            placeholder="Ex: 3"
            maxLength={3}
            {...register("dias_entre_parcelas")}
            error={errors.descricao}
            isRequired
          />

          <Input
            mt={4}
            type="number"
            label="Plano contas"
            placeholder="Ex: 1234"
            {...register("plano_contas")}
            error={errors.descricao}
            isRequired
          />
        </Flex>
      </Box>
    </form>
  );
}
