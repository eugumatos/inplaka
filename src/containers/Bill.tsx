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
import { filterText } from "@/utils/filterText";
import { currency } from "@/utils/currency";
import { upper } from "@/utils/upper";
import { formatDate } from "@/utils/formatDate";

export function Bill() {
  const {
    bills,
    isLoading,
    addBill,
    editBill,
    removeBill,
    supplierOptions,
    paymentFormOptions,
  } = useBills();

  const [currentBill, setCurrentBill] = useState<IBill | null>(null);

  const { handleSubmit, reset, setValue, formState } =
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

  const seekPaymentFormSelectedOption = async (id: string) => {
    const findPaymentForm = (await paymentFormOptions("")).find(
      (paymentForm) => paymentForm.value === id
    );

    if (findPaymentForm) {
      return findPaymentForm;
    }
  };

  const renderFormCreateModal = () => {
    return (
      <ModalDialog
        maxWidth="70%"
        textAction="Criar"
        isOpen={disclosureFormCreateModal.isOpen}
        onClose={disclosureFormCreateModal.onClose}
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
        onClose={disclosureFormEditModal.onClose}
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

            if (key === "forma_Pagamento") {
              const formPayment = await seekPaymentFormSelectedOption(
                row.forma_Pagamento
              );

              return setValue(
                "forma_pagamento",
                formPayment ?? { value: "", label: "" }
              );
            }

            return setValue(key, row[key]);
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
