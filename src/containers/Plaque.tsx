import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  FormLabel,
  HStack,
  Card,
  Checkbox,
} from "@chakra-ui/react";
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { IClient } from "@/domains/client";
import { IOrder } from "@/domains/order";
import { getOrderByClient, updatePlaques } from "@/services/order";

import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { DataTable } from "@/components/Table";

import { Column } from "react-table";

interface PlaqueProps {
  clients: IClient[];
  orders: IOrder[];
}

export function Plaque({ clients }: PlaqueProps) {
  const [client, setClient] = useState({ value: "", label: "" });

  const [ordersByClient, setOrdersByClient] = useState<IOrder[] | []>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const { control, register, watch } = useForm();

  const currentClient = watch("cliente") as any;

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Quitada",
        accessor: "placa_quitada",
        Cell: ({ row }: any) => (
          <Checkbox
            size="md"
            isChecked={row.original?.placaQuitada}
            onChange={() => {
              setOrdersByClient((previousPlaques: any) => {
                const updatedPlaques = previousPlaques.map((item: any) => {
                  return item.placa === row.original.placa
                    ? {
                        ...item,
                        placaQuitada: !item.placaQuitada,
                      }
                    : { ...item };
                });

                return updatedPlaques;
              });
            }}
          />
        ),
      },
      {
        Header: "Placa",
        accessor: "placa",
      },
      {
        Header: "Descrição",
        accessor: "descricao",
      },
    ],
    []
  );

  async function clientOptions(value: string) {
    try {
      const sellers = clients || [];
      const options = sellers
        .map((seller) => ({
          value: seller.id,
          label: seller.apelido,
        }))
        .filter((item) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar vendedores");

      return [];
    }
  }

  async function loadOrdersByClient() {
    if (client.value === "") {
      toast.warning("Você deve selecionar um cliente antes de continuar.");

      return;
    }

    try {
      setIsLoadingOrders(true);
      const response = await getOrderByClient(client.value);

      setOrdersByClient(response);
      setIsLoadingOrders(false);
    } catch (error) {
      setIsLoadingOrders(false);
      toast.error("Erro ao carrregar placas deste pedido.");
    }
  }

  function updateProducts() {
    const updatedPlaques = ordersByClient.filter(
      (item) => item.placaQuitada === true
    );

    updatedPlaques.forEach(async (item: any) => {
      try {
        await updatePlaques(item);
      } catch (error) {
        toast.error("Erro ao atualizar placas.");

        return;
      }
    });

    toast.success("Placas selecionadas quitadas com sucesso!");
  }

  return (
    <Box w="100%" flex={1}>
      <Flex justifyContent="space-between" mb={8}>
        <Heading as="h3" fontSize={26}>
          Baixa de placas
        </Heading>
      </Flex>

      <Card bg="whiteAlpha.600" p={5}>
        <HStack w="45%" mb={10}>
          <Box flex={1}>
            <FormLabel color="gray.500" fontWeight="bold">
              Cliente:
            </FormLabel>
            <AsyncSelect
              control={control}
              loadOptions={clientOptions}
              value={currentClient}
              onChangeOption={setClient}
              {...register("cliente")}
            />
          </Box>
          <Button
            marginTop="auto"
            fontSize={15}
            bg="pink.300"
            color="gray.50"
            _hover={{
              bg: "pink.400",
            }}
            onClick={() => loadOrdersByClient()}
          >
            BUSCAR
          </Button>
        </HStack>

        <DataTable
          isLoading={isLoadingOrders}
          columns={columns}
          data={ordersByClient}
        />

        <Button
          w={120}
          ml="auto"
          marginTop="10"
          fontSize={15}
          bg="green.400"
          color="gray.50"
          _hover={{
            bg: "green.500",
          }}
          onClick={() => updateProducts()}
        >
          EDITAR
        </Button>
      </Card>
    </Box>
  );
}
