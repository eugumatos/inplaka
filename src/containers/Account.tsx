import { useAccounts } from "@/contexts/AccountContext";
import { AccountFormData } from "@/schemas/AccountSchemaValidation";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { AccountForm } from "@/components/Forms/AccountForm";
import { ModalDialog } from "@/components/Modals";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { DataTable } from "@/components/Table";

import { IAccount } from "@/domains/account";
import { filterText } from "@/utils/filterText";
import { currency } from "@/utils/currency";
import { upper } from "@/utils/upper";

export function Account() {
  const { accounts, isLoading, addAccount, editAccount, removeAccount } =
    useAccounts();

  const [currentAccount, setCurrentAccount] = useState<IAccount | null>(null);

  const { handleSubmit, reset, setValue, formState } =
    useFormContext<AccountFormData>();

  const hasErrors = formState.isValid;

  const disclosureFormCreateModal = useDisclosure();
  const disclosureFormEditModal = useDisclosure();
  const disclosureDestroyModal = useDisclosure();

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Descrição",
        accessor: "descricao",
        Cell: ({ value }) => filterText(upper(value), 20),
      },
      {
        Header: "Saldo",
        accessor: "saldo",
        Cell: ({ value }) => currency(value),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => upper(value),
      },
    ],
    []
  );

  const seekCurrentAccount = (account: IAccount) => {
    const findAccount = accounts.find((a) => a.id === account.id);

    if (findAccount) {
      setCurrentAccount(findAccount);
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
          handleSubmit(addAccount)();

          if (hasErrors) {
            disclosureFormCreateModal.onClose();
          }
        }}
      >
        <AccountForm />
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
          handleSubmit(editAccount)();

          if (hasErrors) {
            disclosureFormEditModal.onClose();
          }
        }}
      >
        <AccountForm />
      </ModalDialog>
    );
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => {
          if (currentAccount) {
            removeAccount(currentAccount);
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
          Contas
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
          CRIAR CONTA
        </Button>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={accounts}
        onRowEdit={(row) => {
          Object.keys(row).forEach((key: any) => {
            return setValue(key, row[key]);
          });

          disclosureFormEditModal.onOpen();
        }}
        onRowDelete={(row) => {
          seekCurrentAccount(row);
          disclosureDestroyModal.onOpen();
        }}
      />

      {renderFormCreateModal()}
      {renderFormEditModal()}

      {renderDestroyModal()}
    </Box>
  );
}
