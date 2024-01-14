import { useFormContext, Controller } from "react-hook-form";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Input as I,
  InputGroup,
  InputLeftAddon,
  Text,
} from "@chakra-ui/react";
import { AccountFormData } from "@/schemas/AccountSchemaValidation";
import { Input } from "@/components/Input";
import { InputCurrency } from "@/components/Input/InputCurrency";
import { NumericFormat } from "react-number-format";
import { Select } from "@/components/Select";

export function AccountForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AccountFormData>();

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Dados da conta</Heading>
        <Flex gap={4} alignItems="center" wrap="wrap">
          <Input
            mt={4}
            type="number"
            maxW="20%"
            label="Número"
            placeholder="Ex: 1432..."
            {...register("numero")}
          />
          <Input
            mt={4}
            maxW="20%"
            label="Banco"
            placeholder="Ex: Itaú"
            {...register("banco")}
          />

          <Input
            mt={4}
            maxW="20%"
            type="number"
            label="Agência"
            placeholder="Ex: 0489"
            {...register("agencia")}
          />

          <Flex direction="column" flex={1} gap={2}>
            <Flex gap={2}>
              <Text>Saldo </Text>
              <Text color="red.500">*</Text>
            </Flex>
            <InputCurrency
              mt={2}
              name="saldo"
              placeholder="R$ 5.000"
              control={control}
              error={errors.saldo}
            />
          </Flex>
        </Flex>

        <Divider my={3} orientation="horizontal" />

        <Flex gap={4} alignItems="center">
          <Input
            mt={4}
            maxW="90%"
            label="Descrição"
            placeholder="Ex: Inplaka..."
            error={errors.descricao}
            {...register("descricao")}
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
