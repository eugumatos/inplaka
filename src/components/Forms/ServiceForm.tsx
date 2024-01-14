import { useFormContext } from "react-hook-form";
import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { ServiceFormData } from "@/schemas/ServiceSchemaValidation";
import { Input } from "@/components/Input";
import { InputCurrency } from "@/components/Input/InputCurrency";
import { Select } from "@/components/Select";

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
        <Flex gap={4} alignItems="center" wrap="wrap">
          <Input
            mt={4}
            maxW="75%"
            label="Descrição"
            placeholder="Ex: Inplaka"
            {...register("descricao")}
            error={errors.descricao}
            isRequired
          />
          <Flex direction="column" flex={1} gap={2}>
            <Flex gap={2}>
              <Text>Valor venda </Text>
              <Text color="red.500">*</Text>
            </Flex>
            <InputCurrency
              mt={2}
              name="valor_venda"
              placeholder="R$ 5.000"
              control={control}
              error={errors.valor_venda}
            />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems="center">
          <Input
            mt={4}
            label="Código serviço NFSE"
            maxLength={4}
            placeholder="Ex: 12"
            {...register("codigo_servico_nfse")}
          />

          <Input
            mt={4}
            maxW="15%"
            label="Aliquota"
            maxLength={6}
            type="number"
            placeholder="Ex: 14"
            {...register("aliquota_nfse")}
            error={errors.aliquota_nfse}
            isRequired
          />

          <Input
            mt={4}
            type="number"
            label="Unidade"
            placeholder="Ex: 12"
            {...register("unidade")}
            error={errors.unidade}
            isRequired
          />

          <Select
            mt={4}
            label="Usar para NF"
            defaultOption="SIM"
            {...register("nao_usar_para_nota_fiscal")}
          >
            <option value={"true"}>SIM</option>
            <option value={"false"}>NÃO</option>
          </Select>

          <Select
            mt={4}
            maxW="15%"
            label="Status"
            defaultOption="SIM"
            {...register("status")}
            isRequired
          >
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </Select>
        </Flex>
      </Box>
    </form>
  );
}
