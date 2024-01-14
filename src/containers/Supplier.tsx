import { useSuppliers } from "@/contexts/SupplierContext";
import { SupplierFormData } from "@/schemas/SupplierSchemaValidation";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { SupplierForm } from "@/components/Forms/SupplierForm";
import { ModalDialog } from "@/components/Modals";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { DataTable } from "@/components/Table";

import { ISupplier } from "@/domains/supplier";
import { filterText } from "@/utils/filterText";
import { upper } from "@/utils/upper";

export function Supplier() {
  const { suppliers, isLoading, addSupplier, editSupplier, removeSupplier } =
    useSuppliers();

  const [currentSupplier, setCurrentSupplier] = useState<ISupplier | null>(
    null
  );

  const { handleSubmit, reset, setValue, formState } =
    useFormContext<SupplierFormData>();

  const hasErrors = formState.isValid;

  const disclosureFormCreateModal = useDisclosure();
  const disclosureFormEditModal = useDisclosure();
  const disclosureDestroyModal = useDisclosure();

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Nome",
        accessor: "nome",
        Cell: ({ value }) => filterText(upper(value), 30),
      },
      {
        Header: "Apelido",
        accessor: "apelido",
        Cell: ({ value }) => filterText(upper(value), 20),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => filterText(upper(value), 55),
      },
    ],
    []
  );

  const seekCurrentSupplier = (supplier: ISupplier) => {
    const findSupplier = suppliers.find((s) => s.id === supplier.id);

    if (findSupplier) {
      seekCurrentSupplier(findSupplier);
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
          handleSubmit(addSupplier)();

          if (hasErrors) {
            disclosureFormCreateModal.onClose();
          }
        }}
      >
        <SupplierForm />
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
          handleSubmit(editSupplier)();

          if (hasErrors) {
            disclosureFormEditModal.onClose();
          }
        }}
      >
        <SupplierForm />
      </ModalDialog>
    );
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => {
          if (currentSupplier) {
            removeSupplier(currentSupplier);
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
          Fornecedores
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
          CRIAR FORNECEDOR
        </Button>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={suppliers}
        onRowEdit={(row) => {
          Object.keys(row).forEach((key: any) => {
            return setValue(key, row[key]);
          });

          disclosureFormEditModal.onOpen();
        }}
        onRowDelete={(row) => {
          setCurrentSupplier(row);
          disclosureDestroyModal.onOpen();
        }}
      />

      {renderFormCreateModal()}
      {renderFormEditModal()}

      {renderDestroyModal()}
    </Box>
  );
}
