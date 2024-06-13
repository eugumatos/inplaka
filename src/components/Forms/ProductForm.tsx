import { useFormContext } from "react-hook-form";
import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { ProductFormData } from "@/schemas/ProductSchemaValidation";
import { Input } from "@/components/Input";
import { InputCurrency } from "@/components/Input/InputCurrency";
import { Select } from "@/components/Select";

type ProductFormProps = {
  isUpdate?: boolean
}

export function ProductForm({ isUpdate }: ProductFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Dados do produto</Heading>
        <Flex gap={4} alignItems="center" wrap="wrap">
          <Input
            mt={4}
            maxW={isUpdate ? "50%" : "75%"}
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
              name="valor_venda_cliente"
              placeholder="R$ 5.000"
              control={control}
              error={errors.valor_venda}
              isDisabled={isUpdate}
            />
          </Flex>
          <Flex direction="column" flex={1} gap={2} hidden={!isUpdate}>
            <Flex gap={2}>
              <Text>Valor venda cliente</Text>
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
            label="CSOSN"
            maxLength={4}
            placeholder="Ex: CSOSN"
            {...register("csosn")}
          />

          <Input
            mt={4}
            label="NCMSH"
            maxLength={8}
            placeholder="Ex: NCMSH"
            {...register("ncmsh")}
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
            maxW="25%"
            label="Controlar estoque"
            defaultOption="SIM"
            {...register("controlar_estoque")}
          >
            <option value={"true"}>SIM</option>
            <option value={"false"}>NÃO</option>
          </Select>
        </Flex>

        <Flex gap={4} alignItems="center">
          <Input
            mt={4}
            maxW="30%"
            type="number"
            label="Código de barras"
            placeholder="Ex: 1234567890987654"
            {...register("codigo_barras")}
          />

          <Input
            mt={4}
            maxW="15%"
            label="Aliquota"
            maxLength={6}
            type="number"
            placeholder="Ex: 14"
            {...register("aliquota_ipi_nfe")}
            error={errors.aliquota_ipi_nfe}
            isRequired
          />

          <Select
            mt={4}
            maxW="15%"
            label="Placa"
            defaultOption="SIM"
            {...register("obriga_placa")}
          >
            <option value={"true"}>SIM</option>
            <option value={"false"}>NÃO</option>
          </Select>

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
