import { useSellers } from "@/contexts/SellerContext";
import { SellerFormData } from "@/schemas/SellerSchemaValidation";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { SellerForm } from "@/components/Forms/SellerForm";
import { ModalDialog } from "@/components/Modals";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { DataTable } from "@/components/Table";

import { ISeller } from "@/domains/seller";
import { filterText } from "@/utils/filterText";
import { upper } from "@/utils/upper";

export function Seller() {
  const { sellers, isLoading, addSeller, editSeller, removeSeller } =
    useSellers();

  const [currentSeller, setCurrentSeller] = useState<ISeller | null>(null);

  const { handleSubmit, reset, setValue, formState } =
    useFormContext<SellerFormData>();

  const hasErrors = formState.isValid;

  const disclosureFormCreateModal = useDisclosure();
  const disclosureFormEditModal = useDisclosure();
  const disclosureDestroyModal = useDisclosure();

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Nome",
        accessor: "nome",
        Cell: ({ value }) => filterText(upper(value)),
      },
      {
        Header: "Apelido",
        accessor: "apelido",
        Cell: ({ value }) => filterText(upper(value)),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => upper(value),
      },
    ],
    []
  );

  const seekCurrentSeller = (seller: ISeller) => {
    const findSeller = sellers.find((s) => s.id === seller.id);

    if (findSeller) {
      setCurrentSeller(findSeller);
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
          handleSubmit(addSeller)();

          if (hasErrors) {
            disclosureFormCreateModal.onClose();
          }
        }}
      >
        <SellerForm />
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
          handleSubmit(editSeller)();

          if (hasErrors) {
            disclosureFormEditModal.onClose();
          }
        }}
      >
        <SellerForm />
      </ModalDialog>
    );
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => {
          if (currentSeller) {
            removeSeller(currentSeller);
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
          Vendedores
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
          CRIAR VENDEDOR
        </Button>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={sellers}
        onRowEdit={(row) => {
          Object.keys(row).forEach(async (key: any) => {
            return setValue(key, row[key]);
          });

          disclosureFormEditModal.onOpen();

          disclosureFormEditModal.onOpen();
        }}
        onRowDelete={(row) => {
          seekCurrentSeller(row);
          disclosureDestroyModal.onOpen();
        }}
      />

      {renderFormCreateModal()}
      {renderFormEditModal()}

      {renderDestroyModal()}
    </Box>
  );
}
