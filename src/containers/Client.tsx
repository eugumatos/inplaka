import { useClients } from "@/contexts/ClientContext";
import { ClientFormData } from "@/schemas/ClientSchemaValidation";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { ClientForm } from "@/components/Forms/ClientForm";
import { ModalDialog } from "@/components/Modals";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { DataTable } from "@/components/Table";

import { IClient } from "@/domains/client";
import { filterText } from "@/utils/filterText";
import { upper } from "@/utils/upper";

export function Client() {
  const {
    clients,
    sellerOptions,
    isLoading,
    addClient,
    editClient,
    removeClient,
  } = useClients();

  const [currentClient, setCurrentClient] = useState<IClient | null>(null);

  const { handleSubmit, reset, setValue, formState } =
    useFormContext<ClientFormData>();

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

  const seekCurrentClient = (client: IClient) => {
    const findClient = clients.find((c) => c.id === client.id);

    if (findClient) {
      setCurrentClient(findClient);
    }
  };

  const seekSelectedOption = async (id: string) => {
    const findSeller = (await sellerOptions("")).find(
      (seller) => seller.value === id
    );

    if (findSeller) {
      return findSeller;
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
          handleSubmit(addClient)();

          if (hasErrors) {
            disclosureFormCreateModal.onClose();
          }
        }}
      >
        <ClientForm />
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
          handleSubmit(editClient)();

          if (hasErrors) {
            disclosureFormEditModal.onClose();
          }
        }}
      >
        <ClientForm />
      </ModalDialog>
    );
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => {
          if (currentClient) {
            removeClient(currentClient);
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
          Clientes
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
          CRIAR CLIENTE
        </Button>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={clients}
        onRowEdit={(row) => {
          Object.keys(row).forEach(async (key: any) => {
            if (key === "vendedorPadrao") {
              const seller = await seekSelectedOption(row.vendedorPadrao);

              return setValue(key, seller);
            }

            return setValue(key, row[key]);
          });

          disclosureFormEditModal.onOpen();
        }}
        onRowDelete={(row) => {
          seekCurrentClient(row);
          disclosureDestroyModal.onOpen();
        }}
      />

      {renderFormCreateModal()}
      {renderFormEditModal()}

      {renderDestroyModal()}
    </Box>
  );
}
