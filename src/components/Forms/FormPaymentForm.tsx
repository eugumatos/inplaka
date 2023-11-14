import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { FormPaymentFormData } from "@/schemas/FormPaymentSchemaValidation";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

export function FormPaymentForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormPaymentFormData>();

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Dados da forma de pagamento</Heading>
        <Flex gap={4} alignItems="center">
          <Input
            mt={4}
            label="Descrição"
            placeholder="Ex: Inplaka"
            {...register("descricao")}
            error={errors.descricao}
            isRequired
          />

          <Input
            mt={4}
            maxW="25%"
            type="number"
            label="Plano de contas"
            placeholder="Ex: 1234"
            {...register("plano_contas")}
            error={errors.plano_contas}
            isRequired
          />

          <Select
            mt={4}
            maxW="25%"
            label="Status"
            defaultOption="ATIVO"
            {...register("status")}
          >
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </Select>
        </Flex>
      </Box>
    </form>
  );
}
