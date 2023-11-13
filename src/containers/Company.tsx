import { useCompanies } from "@/contexts/CompanyContext";
import { CompanyFormData } from "@/schemas/CompanySchemaValidation";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { CompanyForm } from "@/components/Forms/CompanyForm";
import { ModalDialog } from "@/components/Modals";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { DataTable } from "@/components/Table";

import { ICompany } from "@/domains/company";
import { filterText } from "@/utils/filterText";
import { formatCnpjCpf } from "@/utils/formatCnpjCpf";
import { upper } from "@/utils/upper";

export function Company() {
  const { companies, isLoading, addCompany, editCompany, removeCompany } =
    useCompanies();

  const [currentCompany, setCurrentCompany] = useState<ICompany | null>(null);

  const { handleSubmit, reset, setValue, formState } =
    useFormContext<CompanyFormData>();

  const hasErrors = formState.isValid;

  const disclosureFormCreateModal = useDisclosure();
  const disclosureFormEditModal = useDisclosure();
  const disclosureDestroyModal = useDisclosure();

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "CNPJ",
        accessor: "cnpj",
        Cell: ({ value }) => formatCnpjCpf(value),
      },
      {
        Header: "Fantasia",
        accessor: "fantasia",
        Cell: ({ value }) => filterText(upper(value), 20),
      },
      {
        Header: "Razão Social",
        accessor: "razao_social",
        Cell: ({ value }) => filterText(value, 55),
      },
    ],
    []
  );

  const seekCurrentCompany = (company: ICompany) => {
    const findCompany = companies.find((c) => company.id === company.id);

    if (findCompany) {
      setCurrentCompany(findCompany);
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
          handleSubmit(addCompany)();

          if (hasErrors) {
            disclosureFormCreateModal.onClose();
          }
        }}
      >
        <CompanyForm />
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
          handleSubmit(editCompany)();

          if (hasErrors) {
            disclosureFormEditModal.onClose();
          }
        }}
      >
        <CompanyForm />
      </ModalDialog>
    );
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => {
          if (currentCompany) {
            removeCompany(currentCompany);
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
          Empresas
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
          CRIAR EMPRESA
        </Button>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={companies}
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
