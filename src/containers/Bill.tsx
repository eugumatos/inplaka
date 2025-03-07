import { useBills } from "@/contexts/BillContext";
import { BillFormData } from "@/schemas/BillSchemaValidation";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { BillForm } from "@/components/Forms/BillForm";
import { ModalDialog } from "@/components/Modals";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { DataTable } from "@/components/Table";

import { IBill } from "@/domains/bill";
import { currency } from "@/utils/currency";
import { filterText } from "@/utils/filterText";
import { formatDate } from "@/utils/formatDate";
import { lower } from "@/utils/lower";
import { upper } from "@/utils/upper";

export function Bill() {
  const { bills, isLoading, addBill, editBill, removeBill, supplierOptions } =
    useBills();

  const [currentBill, setCurrentBill] = useState<IBill | null>(null);

  const { handleSubmit, reset, setValue, formState, clearErrors } =
    useFormContext<BillFormData>();

  const hasErrors = formState.isValid;

  const disclosureFormCreateModal = useDisclosure();
  const disclosureFormEditModal = useDisclosure();
  const disclosureDestroyModal = useDisclosure();

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Nome da conta",
        accessor: "nome_Conta",
        Cell: ({ value }) => filterText(upper(value), 20),
      },
      {
        Header: "Documento",
        accessor: "documento",
      },
      {
        Header: "Data da Emissão",
        accessor: "data_Emissao",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Data de Vencimento",
        accessor: "data_Vencimento",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Valor total",
        accessor: "valor",
        Cell: ({ value }) => currency(value),
      },
    ],
    []
  );

  const seekCurrentBill = (bill: IBill) => {
    const findBill = bills.find((b) => b.id === bill.id);

    if (findBill) {
      setCurrentBill(findBill);
    }
  };

  const seekSupplierSelectedOption = async (id: string) => {
    const findSupplier = (await supplierOptions("")).find(
      (supplier) => supplier.value === id
    );

    if (findSupplier) {
      return findSupplier;
    }
  };

  const renderFormCreateModal = () => {
    return (
      <ModalDialog
        maxWidth="70%"
        textAction="Criar"
        isOpen={disclosureFormCreateModal.isOpen}
        onClose={() => {
          disclosureFormCreateModal.onClose();
          clearErrors();
        }}
        onAction={() => {
          handleSubmit(addBill)();

          if (hasErrors) {
            disclosureFormCreateModal.onClose();
          }
        }}
      >
        <BillForm />
      </ModalDialog>
    );
  };

  const renderFormEditModal = () => {
    return (
      <ModalDialog
        maxWidth="70%"
        textAction="Editar"
        isOpen={disclosureFormEditModal.isOpen}
        onClose={() => {
          disclosureFormEditModal.onClose();
          clearErrors();
        }}
        onAction={() => {
          handleSubmit(editBill)();

          if (hasErrors) {
            disclosureFormEditModal.onClose();
          }
        }}
      >
        <BillForm />
      </ModalDialog>
    );
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => {
          if (currentBill) {
            removeBill(currentBill);
          }

          disclosureDestroyModal.onClose();
        }}
      />
    );
  };

  return (
    <Box w="100%" flex={1}>
      <Flex justifyContent="space-between" mb={8}>
        <Heading as="h3" fontSize={26}>
          Contas a pagar
        </Heading>
        <Button
          bg="pink.300"
          color="gray.50"
          size="md"
          onClick={() => {
            reset();
            disclosureFormCreateModal.onOpen();
          }}
          _hover={{
            bg: "pink.400",
          }}
        >
          CRIAR CONTA A PAGAR
        </Button>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={bills}
        onRowEdit={(row) => {
          Object.keys(row).forEach(async (key: any) => {
            if (key === "fornecedor") {
              const supplier = await seekSupplierSelectedOption(row.fornecedor);

              return setValue(key, supplier);
            }

            return setValue(lower(key) as any, row[key]);
          });

          disclosureFormEditModal.onOpen();
        }}
        onRowDelete={(row) => {
          seekCurrentBill(row);
          disclosureDestroyModal.onOpen();
        }}
      />

      {renderFormCreateModal()}
      {renderFormEditModal()}

      {renderDestroyModal()}
    </Box>
  );
}
