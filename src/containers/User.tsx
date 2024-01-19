import { useUsers, userRoleTitle } from "@/contexts/UserContext";
import { UserFormData } from "@/schemas/UserSchemaValidation";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { UserForm } from "@/components/Forms/UserForm";
import { ModalDialog } from "@/components/Modals";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { DataTable } from "@/components/Table";

import { IUser } from "@/domains/user";
import { filterText } from "@/utils/filterText";
import { upper } from "@/utils/upper";

export function User() {
  const { users, isLoading, addUser, editUser, removeUser } = useUsers();

  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const { handleSubmit, reset, setValue, formState } =
    useFormContext<UserFormData>();

  const hasErrors = formState.isValid;

  const disclosureFormCreateModal = useDisclosure();
  const disclosureFormEditModal = useDisclosure();
  const disclosureDestroyModal = useDisclosure();

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Nome",
        accessor: "name",
        Cell: ({ value }) => filterText(upper(value), 30),
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ value }) => upper(value),
      },
      {
        Header: "Função",
        accessor: "role",
        Cell: ({ value }) => upper(userRoleTitle[value]),
      },
    ],
    []
  );

  const seekCurrentCompany = (user: IUser) => {
    const findUser = users.find((u) => u.id === user.id);

    if (findUser) {
      setCurrentUser(findUser);
    }
  };

  const renderFormCreateModal = () => {
    return (
      <ModalDialog
        maxWidth="60%"
        textAction="Criar"
        isOpen={disclosureFormCreateModal.isOpen}
        onClose={disclosureFormCreateModal.onClose}
        onAction={() => {
          handleSubmit(addUser)();

          if (hasErrors) {
            disclosureFormCreateModal.onClose();
          }
        }}
      >
        <UserForm />
      </ModalDialog>
    );
  };

  const renderFormEditModal = () => {
    return (
      <ModalDialog
        maxWidth="60%"
        textAction="Editar"
        isOpen={disclosureFormEditModal.isOpen}
        onClose={disclosureFormEditModal.onClose}
        onAction={() => {
          handleSubmit(editUser)();

          if (hasErrors) {
            disclosureFormEditModal.onClose();
          }
        }}
      >
        <UserForm isUpdate />
      </ModalDialog>
    );
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => {
          if (currentUser) {
            removeUser(currentUser);
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
          Usuários
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
          CRIAR USUÁRIO
        </Button>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={users}
        onRowEdit={(row) => {
          Object.keys(row).forEach((key: any) => {
            return setValue(key, row[key]);
          });

          disclosureFormEditModal.onOpen();
        }}
        onRowDelete={(row) => {
          seekCurrentCompany(row);
          disclosureDestroyModal.onOpen();
        }}
      />

      {renderFormCreateModal()}
      {renderFormEditModal()}

      {renderDestroyModal()}
    </Box>
  );
}
