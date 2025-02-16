import { Box, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Column } from "react-table";

import { PermissionForm } from "@/components/Forms/PermissionForm";
import { ModalDialog } from "@/components/Modals";
import { DataTable } from "@/components/Table";
import { usePermissions } from "@/contexts/PermissionsContext";
import { filterText } from "@/utils/filterText";

export function PermissionsContainer() {
  const { permissions, refetchPermissions, isLoading } = usePermissions();
  const disclosureFormEditModal = useDisclosure();

  const [id, setId] = useState("");

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Função",
        accessor: "nome",
        Cell: ({ value }) => filterText(value),
      },
    ],
    []
  );

  const renderFormEditModal = () => {
    return (
      <ModalDialog
        maxWidth="50%"
        textAction="Editar"
        isOpen={disclosureFormEditModal.isOpen}
        onClose={disclosureFormEditModal.onClose}
        noCancel
        noAction
      >
        <PermissionForm id={id} refetch={refetchPermissions} />
      </ModalDialog>
    );
  };

  return (
    <Box w="100%" flex={1}>
      <Flex justifyContent="space-between" mb={8}>
        <Heading as="h3" fontSize={26}>
          Rotas por função
        </Heading>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        onRowEdit={(row) => {
          setId(row.id);
          disclosureFormEditModal.onOpen();
        }}
        data={permissions}
      />

      {renderFormEditModal()}
    </Box>
  );
}
