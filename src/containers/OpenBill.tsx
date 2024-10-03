import { useOpenBills } from "@/contexts/OpenBillContext";
import { BillFormData } from "@/schemas/BillSchemaValidation";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Column } from "react-table";

import { ModalDialog } from "@/components/Modals";
import { OpenBillForm } from "@/components/Forms/OpenBillForm";
import { DataTable } from "@/components/Table";

import { filterText } from "@/utils/filterText";
import { currency } from "@/utils/currency";
import { upper } from "@/utils/upper";
import { formatDate } from "@/utils/formatDate";
import { getOpenBillInstalment } from "@/services/biils";
import { toast } from "react-toastify";
import { OpenBillFormData } from "@/schemas/OpenBillSchemaValidation";

export function OpenBill() {
  const { openBills, isLoading, editOpenBill } = useOpenBills();

  const [instalments, setInstalments] = useState<any>([]);
  const [loadingInstalments, setLoadingInstalments] = useState(false);

  const { handleSubmit, reset, formState } =
    useFormContext<OpenBillFormData>();

  const hasErrors = formState.isValid;

  const disclosureFormEditModal = useDisclosure();
  const disclosureEditTable = useDisclosure();

  const columnsInstalments = useMemo(
    (): Column[] => [
      {
        Header: "Conta",
        accessor: "conta",
        Cell: ({ value }) => filterText(upper(value), 20),
      },
      {
        Header: "Número parcela",
        accessor: "valor_Parcela",
        Cell: ({ value }) => currency(value),
      },
    ],
    []
  )

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Conta",
        accessor: "conta",
        Cell: ({ value }) => filterText(upper(value), 20),
      },
      {
        Header: "Número parcelas",
        accessor: "nro_Parcela",
      },
      {
        Header: "Data vencimento",
        accessor: "data_Vencimento",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Valor",
        accessor: "valor_Parcela",
        Cell: ({ value }) => currency(value),
      },
      {
        Header: "Status",
        accessor: "status",
      },
    ],
    []
  );

  const searchOpenBill = async (id: string, instalment: number) => {
    try {
      disclosureEditTable.onOpen();
      setLoadingInstalments(true);

      const allInstallments = await getOpenBillInstalment(id, instalment);

      const formattedInstalments = allInstallments?.parcelas.map((i: any) => {

        return {
          ...i,
          conta: allInstallments?.nome_Conta
        }
      })

      setInstalments(formattedInstalments);
    } catch (error) {
      toast.error('Erro ao carregar parcelas.')
      disclosureEditTable.onClose();
    } finally {
      setLoadingInstalments(false);
    }
  }

  const renderEditTable = () => {
    return (
      <ModalDialog
        maxWidth="60%"
        isOpen={disclosureEditTable.isOpen}
        onClose={() => {
          disclosureEditTable.onClose()
          reset({});
        }}
        onAction={() => {
          disclosureFormEditModal.onOpen()
        }}
      >
        <Heading size="md">Parcelas</Heading>
        <Box mt={4}>
          <DataTable
            isLoading={loadingInstalments}
            columns={columnsInstalments}
            data={instalments}
          />
        </Box>
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
          disclosureEditTable.onClose();
          handleSubmit(editOpenBill)();

          if (hasErrors) {
            disclosureFormEditModal.onClose();
            reset({});
          }
        }}
      >
        <OpenBillForm />
      </ModalDialog>
    )
  }

  return (
    <Box w="100%" flex={1}>
      <Flex justifyContent="space-between" mb={8}>
        <Heading as="h3" fontSize={26}>
          Baixa de contas
        </Heading>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={openBills}
        onRowEdit={(row) => {
          searchOpenBill(row.id_Conta, row.nro_Parcela);
        }}
      />

      {renderEditTable()}
      {renderFormEditModal()}
    </Box>
  );
}
