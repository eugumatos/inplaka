import { useFormContext } from "react-hook-form";
import {
  Box,
  Flex,
  Heading,
  Text,
  FormLabel,
} from "@chakra-ui/react";
import { Input } from "@/components/Input";
import { InputCurrency } from "@/components/Input/InputCurrency";
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import DatePicker from "react-datepicker";
import { useOpenBills } from "@/contexts/OpenBillContext";
import { OpenBillFormData } from "@/schemas/OpenBillSchemaValidation";

export function OpenBillForm() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OpenBillFormData>();

  const { paymentFormOptions } = useOpenBills();

  const currentPaymentForm = watch("forma_pagamento") as any;

  const currentDatePayment = watch("data_pagamento") as any;

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Dados da parcela</Heading>

        <Flex gap={4} alignItems="center">
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
          <Flex>
            <InputCurrency
              name="valor"
              label="Valor"
              placeholder="R$ 1.200"
              control={control}
              error={errors?.valor}
            />
          </Flex>
          <Box flex={1} mt="-10px">
            <Flex>
              <FormLabel>Forma pagamento</FormLabel>
              <Text color="red.500">*</Text>
            </Flex>
            <AsyncSelect
              control={control}
              loadOptions={paymentFormOptions}
              value={currentPaymentForm}
              error={errors?.forma_pagamento?.label}
              {...register("forma_pagamento")}
            />
          </Box>
        </Flex>
        <Box maxW={300}>
          <Flex gap={2}>
            <Text>Data do Pagamento</Text>
            <Text color="red.500">*</Text>
          </Flex>
          <DatePicker
            selected={currentDatePayment}
            onChange={(date) => setValue("data_pagamento", date as any)}
            placeholderText="Data do Pagamento"
            className={`chakra-datepicker-input ${errors?.data_pagamento && "chakra-datepicker-error"
              }`}
          />
          {errors?.data_pagamento && (
            <Text fontSize="sm" color="red.400">
              {errors.data_pagamento?.message}
            </Text>
          )}
        </Box>
      </Box>
    </form>
  );
}
