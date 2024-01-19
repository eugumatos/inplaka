import React, { useMemo, useState } from "react";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { DataTable } from "@/components/Table";
import { ServiceForm } from "@/components/Forms/ServiceForm";
import { ModalDialog } from "@/components/Modals";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { filterText } from "@/utils/filterText";
import { currency } from "@/utils/currency";
import { IService } from "@/domains/service";
import { useService } from "@/contexts/ServiceContext";
import { ServiceFormData } from "@/schemas/ServiceSchemaValidation";

export function Service() {
  const { services, isLoading, addService, editService, removeService } =
    useService();

  const [currentService, setCurrentService] = useState<IService | null>(null);

  const { handleSubmit, reset, setValue, formState } =
    useFormContext<ServiceFormData>();

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
        Header: "Valor venda",
        accessor: "valor_venda",
        Cell: ({ value }) => currency(value),
      },
      {
        Header: "Usar para NF",
        accessor: "nao_usar_para_nota_fiscal",
        Cell: ({ value }) => (value ? "SIM" : "NÃO"),
      },
      {
        Header: "Aliquota",
        accessor: "aliquota_nfse",
      },
      {
        Header: "Status",
        accessor: "status",
      },
    ],
    []
  );

  const seekCurrentService = (service: IService) => {
    const findService = services.find((s) => s.id === service.id);

    if (findService) {
      setCurrentService(findService);
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
          handleSubmit(addService)();

          if (hasErrors) {
            disclosureFormCreateModal.onClose();
          }
        }}
      >
        <ServiceForm />
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
          handleSubmit(editService)();

          if (hasErrors) {
            disclosureFormEditModal.onClose();
          }
        }}
      >
        <ServiceForm />
      </ModalDialog>
    );
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => {
          if (currentService) {
            removeService(currentService);
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
          Serviços
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
          CRIAR SERVIÇO
        </Button>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={services}
        onRowEdit={(row) => {
          Object.keys(row).forEach((key: any) => {
            return setValue(key, row[key]);
          });

          disclosureFormEditModal.onOpen();
        }}
        onRowDelete={(row) => {
          seekCurrentService(row);
          disclosureDestroyModal.onOpen();
        }}
      />

      {renderFormCreateModal()}
      {renderFormEditModal()}

      {renderDestroyModal()}
    </Box>
  );
}
