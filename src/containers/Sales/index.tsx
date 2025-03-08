import { RangeDatePicker } from "@/components/Forms/RangeDatePicker";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { SalleFormData } from "@/schemas/SalleSchemaValidation";
import { getClients } from "@/services/clients";
import { getOrderSalle } from "@/services/order";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { PDFDocument } from "./document";

type RangeDate = {
  startDate: Date | null;
  endDate: Date | null;
};

type SelectProps = {
  value: string;
  label: string;
};

export function Sales() {
  const [currentClient, setCurrentClient] = useState<SelectProps>();

  const { register, control, handleSubmit, reset } = useForm<SalleFormData>();

  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [filteredDate, setFilteredDate] = useState({ start: "", end: "" });

  const rangePickerRef = useRef<{ resetDates: () => void }>(null);

  const [rangeDate, setRangeDate] = useState<RangeDate>({
    startDate: null,
    endDate: null,
  });

  function resetForm() {
    if (rangePickerRef.current) {
      rangePickerRef.current.resetDates();
    }

    reset({});
  }

  async function clientOptions(value: string): Promise<SelectProps[]> {
    try {
      const clients = await getClients();

      const options = clients
        .map((client) => ({
          value: client.id,
          label: client.apelido,
        }))
        .filter((item) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar clientes");

      return [];
    }
  }

  async function handleSearchSales(data: SalleFormData) {
    try {
      const formData = {
        idClient: currentClient?.value,
        startDate: rangeDate.startDate
          ? format(rangeDate.startDate, "yyyy-MM-dd")
          : undefined,
        endDate: rangeDate.endDate
          ? format(rangeDate.endDate, "yyyy-MM-dd")
          : undefined,
        status: data.status,
        idOrder: String(data.numero_pedido),
      };

      const res = await getOrderSalle(formData);

      toast.success(`Foi encontrado um total de ${res.length} pedidos.`);

      setFilteredOrders(res as any);

      resetForm();
    } catch (error) {
      toast.error("Erro ao buscar pedidos.");
    }
  }

  return (
    <Box w="100%" flex={1}>
      <Box mb={8}>
        <Heading as="h3" fontSize={26}>
          Vendas
        </Heading>
      </Box>

      <Box background="#fff" padding={5} borderRadius={10}>
        <form onSubmit={handleSubmit(handleSearchSales)}>
          <Flex gap={4} alignItems="center">
            <Flex flex={1}>
              <Select
                mt={4}
                label="Status"
                defaultOption="EM ABERTO"
                {...register("status")}
              >
                <option value="">Selecione uma opção</option>
                <option value="EM ABERTO">EM ABERTO</option>
                <option value="QUITADO">QUITADO</option>
              </Select>
            </Flex>
            <Flex flex={1}>
              <AsyncSelect
                mt={-10}
                label="Cliente"
                control={control}
                value={currentClient}
                loadOptions={clientOptions}
                onChangeOption={setCurrentClient}
                {...register("cliente")}
              />
            </Flex>
            <Flex flex={1}>
              <Input
                mt={4}
                type="number"
                label="Número pedido"
                placeholder="Ex: 1265"
                {...register("numero_pedido")}
              />
            </Flex>
          </Flex>

          <Flex>
            <RangeDatePicker
              ref={rangePickerRef}
              getRangeDate={() => {}}
              onChangeDateStart={(start) =>
                setRangeDate({ ...rangeDate, startDate: start })
              }
              onChangeDateEnd={(end) =>
                setRangeDate({ ...rangeDate, endDate: end })
              }
              noSearch
            />
            <Button type="submit" color="#fff" bg="teal.400">
              BUSCAR
            </Button>
          </Flex>
        </form>
      </Box>

      <Box mt={10}>
        <Text size="md">Pedidos encontrados: {filteredOrders.length}</Text>

        {filteredOrders.length > 0 && (
          <PDFDownloadLink
            document={
              <PDFDocument
                orders={filteredOrders}
                startDate={filteredDate.start}
                endDate={filteredDate.end}
                total={filteredOrders.reduce(
                  (sum, item) => sum + item.valorTotal,
                  0
                )}
              />
            }
            fileName={`relatorio-vendas${format(new Date(), "dd-MM-yyyy")}`}
          >
            <Button
              mt={3}
              bg="pink.300"
              color="gray.50"
              onClick={() => {}}
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
