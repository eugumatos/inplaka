import React, { useMemo } from "react";
import { Box, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { ModalDialog } from "@/components/Modals";
import { DataTable } from "@/components/Table";
import { StockForm } from "@/components/Forms/StockForm";

import { filterText } from "@/utils/filterText";
import { currency } from "@/utils/currency";
import { useStock } from "@/contexts/StockContext";
import { StockFormData } from "@/schemas/StockSchemaValidation";

export function Stock() {
  const { stock, isLoading, editStock } = useStock();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { handleSubmit, reset, setValue, formState } =
    useFormContext<StockFormData>();

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Descrição",
        accessor: "descricao",
        Cell: ({ value }) => filterText(value),
      },
      {
        Header: "Produto",
        accessor: "produto",
        Cell: ({ value }) => filterText(value),
      },
      {
        Header: "Quantidade",
        accessor: "quantidade",
      },
      {
        Header: "Saldo anterior",
        accessor: "saldoAnterior",
        Cell: ({ value }) => currency(value),
      },
      {
        Header: "Saldo atual",
        accessor: "saldoAtual",
        Cell: ({ value }) => currency(value),
      },
    ],
    []
  );

  const hasErrors = formState.isValid;

  const renderEditFormModal = () => {
    return (
      <ModalDialog
        maxWidth="40%"
        textAction="Editar"
        isOpen={isOpen}
        onClose={onClose}
        onAction={() => {
          handleSubmit(editStock)();

          if (hasErrors) {
            onClose();
          }
        }}
      >
        <StockForm />
      </ModalDialog>
    );
  };

  return (
    <Box w="100%" flex={1}>
      <Flex justifyContent="space-between" mb={8}>
        <Heading as="h3" fontSize={26}>
          Estoque
        </Heading>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={stock}
        onRowEdit={(row) => {
          Object.keys(row).forEach((key: any) => {
            return setValue(key, row[key]);
          });

          onOpen();
        }}
      />

      {renderEditFormModal()}
    </Box>
  );
}
