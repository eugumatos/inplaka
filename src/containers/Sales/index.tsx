import React, { useState } from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { filterOrderByDate } from "@/services/order";
import { RangeDatePicker } from "@/components/Forms/RangeDatePicker";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFDocument } from "./document";

type RangeDate = {
  startDate: Date | null;
  endDate: Date | null;
};

export function Sales() {
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [filteredDate, setFilteredDate] = useState({ start: "", end: "" });

  async function filterOrder({ startDate, endDate }: RangeDate) {
    try {
      if (!startDate || !endDate) return;

      const orders = await filterOrderByDate(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );

      setFilteredDate({
        start: format(startDate, "dd/MM/yyyy"),
        end: format(endDate, "dd/MM/yyyy"),
      });

      setFilteredOrders(orders);

      toast.success(`Foi encontrado um total de ${orders.length} pedidos.`);
    } catch (error) {
      toast.error("Erro buscar pedidos.");
    }
  }

  /*
  useEffect(() => {
    async function getServices() {
      try {
        const data = await getClients();

      } catch (error) {
        throw new Error("Erro ao buscar clientes");
      }
    }

    getServices();
  });
  */

  return (
    <Box w="100%" flex={1}>
      <Box mb={8}>
        <Heading as="h3" fontSize={26}>
          Vendas
        </Heading>
      </Box>
      <RangeDatePicker getRangeDate={filterOrder} />

      <Box mt={10}>
        <Text size="md">Pedidos encontrados: {filteredOrders.length}</Text>

        {filteredOrders.length > 0 && (
          <PDFDownloadLink
            document={
              <PDFDocument
                orders={filteredOrders}
                startDate={filteredDate.start}
                endDate={filteredDate.end}
              />
            }
            fileName={`vendas`}
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
