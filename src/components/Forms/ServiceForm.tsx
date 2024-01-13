import { Input } from "@/components/Input";
import { ServiceFormData } from "@/schemas/ServiceSchemaValidation";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { InputCurrency } from "@/components/Input/InputCurrency";
import { Select } from "@/components/Select";
import { useFormContext } from "react-hook-form";

export function ServiceForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ServiceFormData>();

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Dados do serviço</Heading>
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
            label="Valor venda"
            placeholder="Ex: 1234"
            {...register("valor_venda")}
            error={errors.valor_venda}
            isRequired
          />

          <Input
            mt={4}
            label="Código serviço NFSE"
            placeholder="Ex: 12"
            {...register("codigo_servico_nfse")}
            error={errors.descricao}
            isRequired
          />

          <Input
            mt={4}
            label="Código serviço NFSE"
            placeholder="Ex: 12"
            {...register("aliquota_nfse")}
            error={errors.descricao}
            isRequired
          />

          <InputCurrency
            control={control}
            maxLength={10}
            label="Unidade"
            placeholder="Ex: 12"
            error={errors.unidade}
            {...register("unidade")}
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
