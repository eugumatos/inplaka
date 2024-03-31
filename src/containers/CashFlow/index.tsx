import React, { useState } from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { filterOrderByDate } from "@/services/order";
import { RangeDatePicker } from "@/components/Forms/RangeDatePicker";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFDocument } from "./document";

export function CashFlow() {
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);

  async function filterOrder() {
    try {
      const orders = await filterOrderByDate(
        format(new Date(), "yyyy-MM-dd"),
        format(new Date(), "yyyy-MM-dd")
      );

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
          Caixa
        </Heading>
      </Box>

      <Box mt={10}>
        {filteredOrders.length === 0 ? (
          <Button
            mt={3}
            bg="pink.300"
            color="gray.50"
            onClick={() => filterOrder()}
            _hover={{
              bg: "pink.400",
            }}
          >
            BUSCAR PEDIDOS
          </Button>
        ) : (
          <PDFDownloadLink
            document={
              <PDFDocument
                orders={filteredOrders}
                startDate={format(new Date(), "dd/MM/yyyy")}
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
