import React, { useMemo, useState } from "react";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { useFormPayment } from "@/contexts/FormPaymentContext";
import { FormPaymentFormData } from "@/schemas/FormPaymentSchemaValidation";
import { DataTable } from "@/components/Table";
import { FormPaymentForm } from "@/components/Forms/FormPaymentForm";
import { ModalDialog } from "@/components/Modals";
import { DestroyModal } from "@/components/Modals/DestroyModal";

import { IFormPayment } from "@/domains/form-payment";

export function FormPayment() {
  const {
    formPayments,
    isLoading,
    addFormPayment,
    editFormPayment,
    removeFormPayment,
  } = useFormPayment();

  const [currentFormPayment, setCurrentFormpayment] =
    useState<IFormPayment | null>(null);

  const { handleSubmit, reset, setValue, formState } =
    useFormContext<FormPaymentFormData>();

  const hasErrors = formState.isValid;

  const disclosureFormCreateModal = useDisclosure();
  const disclosureFormEditModal = useDisclosure();
  const disclosureDestroyModal = useDisclosure();

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Descrição",
        accessor: "descricao",
      },
      {
        Header: "Plano contas",
        accessor: "plano_contas",
      },
      {
        Header: "Status",
        accessor: "status",
      },
    ],
    []
  );

  const seekCurrentFormPayment = (formPayment: IFormPayment) => {
    const findFormPayment = formPayments.find((f) => f.id === formPayment.id);

    if (findFormPayment) {
      setCurrentFormpayment(findFormPayment);
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
          handleSubmit(addFormPayment)();

          if (hasErrors) {
            disclosureFormCreateModal.onClose();
          }
        }}
      >
        <FormPaymentForm />
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
          handleSubmit(editFormPayment)();

          if (hasErrors) {
            disclosureFormEditModal.onClose();
          }
        }}
      >
        <FormPaymentForm />
      </ModalDialog>
    );
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => {
          if (currentFormPayment) {
            removeFormPayment(currentFormPayment);
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
          Forma de pagamento
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
          CRIAR FORMA DE PAGAMENTO
        </Button>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={formPayments}
        onRowEdit={(row) => {
          Object.keys(row).forEach((key: any) => {
            return setValue(key, row[key]);
          });

          disclosureFormEditModal.onOpen();
        }}
        onRowDelete={(row) => {
          seekCurrentFormPayment(row);
          disclosureDestroyModal.onOpen();
        }}
      />

      {renderFormCreateModal()}
      {renderFormEditModal()}

      {renderDestroyModal()}
    </Box>
  );
}
