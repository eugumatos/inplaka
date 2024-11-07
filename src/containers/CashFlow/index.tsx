import React, { useState, useRef } from "react";
import { Box, Heading, Button, Flex } from "@chakra-ui/react";
import { filterOrderByDateBank } from "@/services/order";
import { RangeDatePicker } from "@/components/Forms/RangeDatePicker";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFDocument } from "./document";
import { currency } from "@/utils/currency";
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { AccountReportFormData } from "@/schemas/AccountReportSchemaValidation";
import { useForm } from "react-hook-form";
import { getAccounts } from "@/services/account";

type RangeDate = {
  startDate: Date | null;
  endDate: Date | null;
};

export function CashFlow() {
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const { register, control, handleSubmit, reset } = useForm<AccountReportFormData>();
  const rangePickerRef = useRef<{ resetDates: () => void }>(null);

  const [currentAccount, setCurrentAccount] = useState<any | null>(null);

  const [rangeDate, setRangeDate] = useState<RangeDate>({
    startDate: null,
    endDate: null,
  });

  async function accountBankOptions(value: string) {
    try {
      const accounts = await getAccounts();
      const options = accounts
        .map((account) => ({
          value: account.id,
          label: account.descricao,
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


  async function filterAccount() {
    try {
      const orders = await filterOrderByDateBank(
        rangeDate.startDate instanceof Date ? rangeDate.startDate.toISOString() : "",
        rangeDate.endDate instanceof Date ? rangeDate.endDate.toISOString() : "",
        currentAccount?.value || "",
      );

      const totalValue = orders.reduce(
        (curr, acc) => Number(acc.valor) + curr,
        0
      );

      setFilteredOrders(orders);
      setTotal(totalValue);

      toast.success(`Foi encontrado um total de ${orders.length} pedidos.`);
    } catch (error) {
      toast.error("Erro buscar pedidos.");
    }
  }

  return (
    <Box w="100%" flex={1}>
      <Box mb={8}>
        <Heading as="h3" fontSize={26}>
          Caixa
        </Heading>
      </Box>

      <Box background="#fff" paddingY={35} paddingX={10} borderRadius={10}>
        <form onSubmit={handleSubmit(filterAccount)}>
          <Flex gap={4} alignItems="center">
            <Flex flex={1}>
              <AsyncSelect
                mt={-10}
                label="Conta bancária"
                control={control}
                value={currentAccount}
                loadOptions={accountBankOptions}
                onChangeOption={setCurrentAccount}
                {...register('contaBancaria')}
              />
            </Flex>
            <Flex mt={5}>
              <RangeDatePicker
                ref={rangePickerRef}
                getRangeDate={() => { }}
                onChangeDateStart={(start) =>
                  setRangeDate({ ...rangeDate, startDate: start })
                }
                onChangeDateEnd={(end) =>
                  setRangeDate({ ...rangeDate, endDate: end })
                }
                noSearch
              />
              <Button type="submit" color="#fff" bg="teal.400">BUSCAR</Button>
            </Flex>
          </Flex>
        </form>
      </Box>


      <Box mt={10}>
        {filteredOrders.length > 0 && (
          <PDFDownloadLink
            document={
              <PDFDocument
                orders={filteredOrders}
                startDate={format(new Date(), "dd/MM/yyyy")}
                total={currency(total)}
              />
            }
            fileName={`relatorio-xpto-${format(new Date(), "dd-MM-yyyy")}`}
          >
            <Button
              mt={3}
              bg="pink.300"
              color="gray.50"
              onClick={() => { }}
              _hover={{
                bg: "pink.400",
              }}
            >
              EXPORTAR
            </Button>
          </PDFDownloadLink>
        )}
      </Box>
    </Box>
  );
}
