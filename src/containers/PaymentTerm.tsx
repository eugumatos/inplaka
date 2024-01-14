import React, { useMemo, useState } from "react";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { usePaymentTerms } from "@/contexts/PaymentTermContext";
import { PaymentTermFormData } from "@/schemas/PaymentTermSchemaValidation";
import { DataTable } from "@/components/Table";
import { PaymentTermForm } from "@/components/Forms/PaymentTermForm";
import { ModalDialog } from "@/components/Modals";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { IPaymentTerms } from "@/domains/payment-term";
import { filterText } from "@/utils/filterText";
import { upper } from "@/utils/upper";

export function PaymentTerm() {
  const {
    paymentTerms,
    isLoading,
    addPaymentTerm,
    editPaymentTerm,
    removePaymentTerm,
  } = usePaymentTerms();

  const [currentPaymentTerm, setCurrentPaymentTerm] =
    useState<IPaymentTerms | null>(null);

  const { handleSubmit, reset, setValue, formState } =
    useFormContext<PaymentTermFormData>();

  const hasErrors = formState.isValid;

  const disclosureFormCreateModal = useDisclosure();
  const disclosureFormEditModal = useDisclosure();
  const disclosureDestroyModal = useDisclosure();

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Descrição",
        accessor: "descricao",
        Cell: ({ value }) => filterText(value),
      },
      {
        Header: "Status",
        accessor: "status",
      },
    ],
    []
  );

  const seekCurrentPaymentTerm = (paymentTerm: IPaymentTerms) => {
    const findPaymentTerm = paymentTerms.find((p) => p.id === paymentTerm.id);

    if (findPaymentTerm) {
      setCurrentPaymentTerm(findPaymentTerm);
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
          handleSubmit(addPaymentTerm)();

          if (hasErrors) {
            disclosureFormCreateModal.onClose();
          }
        }}
      >
        <PaymentTermForm />
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
          handleSubmit(editPaymentTerm)();

          if (hasErrors) {
            disclosureFormEditModal.onClose();
          }
        }}
      >
        <PaymentTermForm />
      </ModalDialog>
    );
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => {
          if (currentPaymentTerm) {
            removePaymentTerm(currentPaymentTerm);
          }

          disclosureDestroyModal.onClose();
        }}
      />
    );
  };

  return (
    <Box flex={1}>
      <Flex justifyContent="space-between" mb={8}>
        <Heading as="h3" fontSize={26}>
          Condições de pagamento
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
          CRIAR CONDIÇÃO DE PAGAMENTO
        </Button>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={paymentTerms}
        onRowEdit={(row) => {
          Object.keys(row).forEach((key: any) => {
            return setValue(key, row[key]);
          });

          disclosureFormEditModal.onOpen();
        }}
        onRowDelete={(row) => {
          seekCurrentPaymentTerm(row);
          disclosureDestroyModal.onOpen();
        }}
      />

      {renderFormCreateModal()}
      {renderFormEditModal()}

      {renderDestroyModal()}
    </Box>
  );
}
