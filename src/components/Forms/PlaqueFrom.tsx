import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { AccountFormData } from "@/schemas/AccountSchemaValidation";
import { Input } from "@/components/Input";
import { InputCurrency } from "@/components/Input/InputCurrency";
import { Select } from "@/components/Select";
import { AsyncSelect } from "../Select/AsyncSelect";
import { toast } from "react-toastify";
import { getAccounts } from "@/services/account";
import { getFormPayments } from "@/services/form-payment";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { PlaqueFormData } from "@/schemas/PlaqueSchemaValidation";

export function PlaqueForm() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PlaqueFormData>();

  const [startDate, setStartDate] = useState<Date | null>(null);

  async function accountOptions(value: string) {
    try {
      const accounts = await getAccounts();
      const options = accounts
        .map((account) => ({
          value: account.id,
          label: account.banco,
        }))
        .filter((item) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar contas.");

      return [];
    }
  }

  async function formPaymentOptions(value: string) {
    try {
      const formPayments = await getFormPayments();
      const options = formPayments
        .map((formPayment) => ({
          value: formPayment.id,
          label: formPayment.descricao,
        }))
        .filter((item) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar forma de pagamentos.");

      return [];
    }
  }

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Dados do pedido</Heading>
        <Flex gap={4} alignItems="center" wrap="wrap">
          <Input
            mt={4}
            maxW="25%"
            label="Valor em aberto"
            placeholder="EX: R$ 500,00"
            {...register("valorEmAbertoAtual")}
            isDisabled
          />
          <Input
            mt={4}
            maxW="25%"
            label="Valor total"
            placeholder="R$ 5000,00"
            {...register("valorTotal")}
            isDisabled
          />

          <Flex direction="column" flex={1} gap={2}>
            <Flex gap={2}>
              <Text>Valor a ser abatido </Text>
            </Flex>
            <InputCurrency
              mt={2}
              name="valorAbatido"
              placeholder="R$ 5.000"
              control={control}
              error={errors.valorAbatido}
            />
          </Flex>
        </Flex>

        <Divider my={3} orientation="horizontal" />

        <Flex gap={4} alignItems="center">
          <Flex direction="column" flex={1} gap={2}>
            <Flex gap={2}>
              <Text>Banco </Text>
              <Text color="red.500">*</Text>
            </Flex>
            <AsyncSelect
              placeHolder="Conta"
              control={control}
              loadOptions={accountOptions}
              error={errors?.conta?.label}
              {...register("conta")}
            />
          </Flex>

          <Flex direction="column" flex={1} gap={2}>
            <Flex gap={2}>
              <Text>Forma de pagamento </Text>
              <Text color="red.500">*</Text>
            </Flex>
            <AsyncSelect
              placeHolder="Forma de pagamento"
              control={control}
              error={errors?.formaPagamento?.label}
              loadOptions={formPaymentOptions}
              {...register("formaPagamento")}
            />
          </Flex>
        </Flex>

        <Divider my={10} />

        <Flex direction="column" flex={1} gap={2} mt={1}>
          <Flex gap={2}>
            <Text>Data recebimento </Text>
          </Flex>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              setValue("dataRecebimento", format(date as any, "yyyy-MM-dd"));
            }}
            maxDate={new Date()}
            startDate={startDate}
            placeholderText="Data recebimento"
            className="chakra-datepicker-input"
          />
        </Flex>
      </Box>
    </form>
  );
}
