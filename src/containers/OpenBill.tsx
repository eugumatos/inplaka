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
  const { openBills, isLoading, editOpenBill, paymentFormOptions } = useOpenBills();

  const [instalments, setInstalments] = useState<any>([]);
  const [loadingInstalments, setLoadingInstalments] = useState(false);

  const { handleSubmit, reset, formState, setValue } =
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
        accessor: "nome_Conta",
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

  const seekPaymentFormSelectedOption = async (id: string) => {
    const findPaymentForm = (await paymentFormOptions("")).find(
      (paymentForm) => paymentForm.value === id
    );

    if (findPaymentForm) {
      return findPaymentForm;
    }
  };

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
        noAction={true}
        onClose={() => {
          disclosureEditTable.onClose()
          reset({});
        }}
      >
        <Heading size="md">Parcelas</Heading>
        <Box mt={4}>
          <DataTable
            isLoading={loadingInstalments}
            columns={columnsInstalments}
            data={instalments}
            onRowEdit={(row) => {
              Object.keys(row).forEach(async (key: any) => {
                if (key === "forma_Pagamento") {
                  const formPayment = await seekPaymentFormSelectedOption(
                    row.forma_Pagamento
                  );

                  return setValue(
                    "forma_pagamento",
                    formPayment ?? { value: "", label: "" }
                  );
                }

                setValue(key, row[key]);
              });

              setValue('valor', row?.valor_Parcela);
              setValue('data_pagamento', row?.data_Pagamento);

              disclosureFormEditModal.onOpen();
            }}
          />
        </Box>
      </ModalDialog>
    );
  };

  const renderFormEditModal = () => {
    return (
      <ModalDialog
        maxWidth="70%"
        textAction="Pagar"
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
