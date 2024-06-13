import { useClients } from "@/contexts/ClientContext";
import { ClientFormData } from "@/schemas/ClientSchemaValidation";
import { Box, Button, Flex, Heading, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Column } from "react-table";
import { RiUserAddLine } from "react-icons/ri";

import { ClientForm } from "@/components/Forms/ClientForm";
import { ModalDialog } from "@/components/Modals";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { DataTable } from "@/components/Table";

import { IClient } from "@/domains/client";
import { filterText } from "@/utils/filterText";
import { upper } from "@/utils/upper";
import { ProductByClientForm } from "@/components/Forms/ProductByClientForm";
import { ProductFormByClientData } from "@/schemas/ProductSchemaValidation";

export function Client() {
  const {
    clients,
    sellerOptions,
    isLoading,
    addClient,
    editClient,
    removeClient,
    editProductByClient
  } = useClients();

  const [currentClient, setCurrentClient] = useState<IClient | null>(null);

  const { handleSubmit, reset, setValue, formState } =
    useFormContext<ClientFormData>();

  const formProductByClient = useForm<ProductFormByClientData>();
  
  const hasErrors = formState.isValid;

  const disclosureFormCreateModal = useDisclosure();
  const disclosureFormEditModal = useDisclosure();
  const disclosureDestroyModal = useDisclosure();
  const disclosureCustomModal = useDisclosure();

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

  const renderCustomValueProductByClientModal = () => {
    return (
      <ModalDialog
        maxWidth="70%"
        textAction="Editar"
        isOpen={disclosureCustomModal.isOpen}
        onClose={disclosureCustomModal.onClose}
        onAction={() => {
          formProductByClient.handleSubmit(editProductByClient)();
          
          if (formProductByClient.formState.isValid) {
            disclosureCustomModal.onClose();
          }

          disclosureCustomModal.onClose();
        }}
      >
        <FormProvider {...formProductByClient}>
          <ProductByClientForm />
        </FormProvider>
      </ModalDialog>
    )
  }

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
    <Box w="100%" flex={1}>
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
        customnAction={(row) => (
            <Tooltip label="Customizar valor produto para este cliente">
              <span>
                <RiUserAddLine
                  size={20}
                  onClick={() => {
                    formProductByClient.reset();
                    formProductByClient.setValue('idCliente', row?.id);
                    disclosureCustomModal.onOpen();
                  }}
                  style={{ cursor: "pointer" }}
                />
              </span>
            </Tooltip>
        )}
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
      {renderCustomValueProductByClientModal()}

      {renderDestroyModal()}
    </Box>
  );
}
