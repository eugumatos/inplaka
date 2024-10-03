import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  Checkbox,
  FormLabel,
} from "@chakra-ui/react";
import { BillFormData } from "@/schemas/BillSchemaValidation";
import { Input } from "@/components/Input";
import { InputCurrency } from "@/components/Input/InputCurrency";
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { getSuppliers } from "@/services/supplier";
import DatePicker from "react-datepicker";
import { getAccounts } from "@/services/account";
import { useBills } from "@/contexts/BillContext";

export function BillForm() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BillFormData>();

  const { supplierOptions } = useBills();

  const currentSupplier = watch("fornecedor") as any;

  const currentDateIssueForm = watch("data_emissao") as any;
  const currentDueDateForm = watch("data_vencimento") as any;

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Dados da Fatura</Heading>

        <Flex gap={4} alignItems="center">
          <Flex flex={1}>
            <Input
              mt={4}
              label="Nome da Conta"
              placeholder="Ex: Energia Elétrica"
              {...register("nome_conta")}
              error={errors?.nome_conta}
              isRequired
            />
          </Flex>

          <Flex flex={1}>
            <Input
              mt={4}
              label="Descrição da conta"
              placeholder="Ex: Descrição detalhada da conta"
              {...register("descricao")}
              error={errors?.descricao}
              isRequired
            />
          </Flex>

          <Flex flex={1}>
            <Input
              mt={4}
              label="Documento"
              placeholder="Ex: 123456"
              {...register("documento")}
              error={errors?.documento}
              isRequired
            />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems="center">
          <Box mt="-8px" flex={1}>
            <Flex>
              <FormLabel>Fornecedor</FormLabel>
              <Text color="red.500">*</Text>
            </Flex>
            <AsyncSelect
              control={control}
              loadOptions={supplierOptions}
              value={currentSupplier}
              error={errors?.fornecedor?.label}
              {...register("fornecedor")}
            />
          </Box>
          <Box flex={1}>
            <Flex>
              <FormLabel>Parcela</FormLabel>
              <Text color="red.500">*</Text>
            </Flex>
            <Input
              label=""
              placeholder="Ex: 1"
              type="number"
              {...register("parcela")}
              error={errors?.parcela}
              isRequired
            />
          </Box>
          <Flex>
            <InputCurrency
              name="valor"
              label="Valor"
              placeholder="R$ 1.200"
              control={control}
              error={errors.valor}
              isRequired
            />
          </Flex>
        </Flex>

        <Flex mt={5} gap={4} alignItems="center">
          <Box flex={1}>
            <Flex gap={2}>
              <Text>Data da Emissão</Text>
              <Text color="red.500">*</Text>
            </Flex>
            <DatePicker
              selected={currentDateIssueForm}
              onChange={(date) => setValue("data_emissao", date as any)}
              placeholderText="Data da Emissão"
              className={`chakra-datepicker-input ${errors?.data_emissao && "chakra-datepicker-error"
                }`}
            />
            {errors?.data_emissao && (
              <Text fontSize="sm" color="red.400">
                {errors.data_emissao.message}
              </Text>
            )}
          </Box>

          <Box flex={1}>
            <Flex gap={2}>
              <Text>Data de Vencimento</Text>
              <Text color="red.500">*</Text>
            </Flex>
            <DatePicker
              selected={currentDueDateForm}
              onChange={(date) => setValue("data_vencimento", date as any)}
              placeholderText="Data de Vencimento"
              className={`chakra-datepicker-input ${errors?.data_vencimento && "chakra-datepicker-error"
                }`}
            />
            {errors?.data_vencimento && (
              <Text fontSize="sm" color="red.400">
                {errors.data_vencimento.message}
              </Text>
            )}
          </Box>
          <Flex mt={4} gap={2} alignItems="center">
            <Checkbox size="md" {...register("recorrente")}>
              Conta Recorrente
            </Checkbox>
          </Flex>
        </Flex>
      </Box>
    </form>
  );
}
