import { useEffect, useState, useMemo } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { Column } from "react-table";

import { getProductByClient } from "@/services/product";
import { IProduct } from "@/domains/product";
import { IPlaque } from "./OrderPlaques";
import { useOrderProducts } from "../contexts/OrderProductContext";

import { DataTable } from "@/components/Table";
import { InputQuantity } from "@/components/Input/InputQuantity";
import { OrderPopover } from "./OrderPopover";

import { currency } from "@/utils/currency";
import { filterText } from "@/utils/filterText";
import { upper } from "@/utils/upper";

import { OrderFormData } from "@/schemas/OrderSchemaValidation";

export function OrderTable() {
  const { products, isLoading, updateProductAmount } = useOrderProducts();

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Descrição",
        accessor: "descricao",
        Cell: ({ value }: any) => filterText(upper(value), 20),
      },
      {
        Header: "Valor venda",
        accessor: "valor_venda_cliente",
        Cell: ({ value }: any) => currency(value),
      },
    ],
    []
  );

  return (
    <DataTable
      isLoading={isLoading}
      columns={columns}
      data={products}
      itemsPerPage={5}
      customnAction={(row) => (
        <Flex gap={4} justify="flex-end">
          <InputQuantity
            maxW="50%"
            name="produto"
            key={row.id}
            maxQ={row.unidade}
            value={Number(row.quantidade)}
            onChangeQuantity={(quantity) => updateProductAmount(row, quantity)}
          />
          <Box>
            <PopoverPlaqueForm
              product={row}
              updateProductPlaque={updateProductPlaque}
              removeProductPlaque={removeProductPlaque}
              isDisabled={+row.unidade <= 0 || !isEditable}
            />
          </Box>
        </Flex>
      )}
    />
  );
}
