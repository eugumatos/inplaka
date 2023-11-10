import { useEffect, useMemo, useState } from "react";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import { Column } from "react-table";
import { yupResolver } from "@hookform/resolvers/yup";

import { DataTable } from "@/components/Table";
import { ModalDialog } from "@/components/Modals";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { CompanyForm } from "@/components/Forms/CompanyForm";
import {
  companyFormSchema,
  CompanyFormData,
} from "@/schemas/CompanySchemaValidation";
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  destroyCompany,
} from "@/services/company";

import { ICompany } from "@/domains/company";
import { filterText } from "@/utils/filterText";
import { formatCnpjCpf } from "@/utils/formatCnpjCpf";
import { upper } from "@/utils/upper";
import { toast } from "react-toastify";

interface HomeProps {
  companies: ICompany[];
}

export default function Home({ companies }: HomeProps) {
  const formCompany = useForm<CompanyFormData>({
    resolver: yupResolver(companyFormSchema),
  });

  const { handleSubmit, reset } = formCompany;

  const disclosureFormModal = useDisclosure();
  const disclosureDestroyModal = useDisclosure();

  const [allCompanies, setAllCompanies] = useState<ICompany[]>(() => {
    if (companies.length > 0) {
      return companies;
    }

    return [];
  });

  const [companyId, setCompanyId] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);

  const findCompanyById = allCompanies.find((c) => c.id === companyId);

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

  const reloadCompanies = async () => {
    try {
      const response = await getCompanies();

      setAllCompanies(response);
    } catch (error) {
      toast.warning("Erro ao recarregar empresas!");
    }
  };

  const searchCompanyById = async (id: string) => {
    try {
      const company = await getCompany(id);

      setCompanyId(id);

      reset(company);
      disclosureFormModal.onOpen();
    } catch (error) {
      toast.warning(
        "Não conseguimos buscar os dados dessa empresa agora, por favor tente novamente!"
      );

      setCompanyId("");
      disclosureFormModal.onClose();
    }
  };

  const removeCompany = async (id: string) => {
    try {
      await destroyCompany(id);

      toast.success("Empresa excluída com sucesso!");
      disclosureDestroyModal.onClose();

      await reloadCompanies();
    } catch (error) {
      toast.error("Erro ao excluir empresa!");
      disclosureDestroyModal.onClose();
    }
  };

  const createNewCompany = async (companyData: CompanyFormData) => {
    try {
      await createCompany(companyData);

      toast.success("Empresa criada com sucesso!");
      disclosureFormModal.onClose();

      await reloadCompanies();
    } catch (error) {
      toast.error("Erro ao criar empresa.");
    }
  };

  const updateCompanyById = async (companyData: CompanyFormData) => {
    console.log("here 2");
  };

  const renderFormModal = () => {
    return (
      <ModalDialog
        maxWidth="70%"
        textAction={isUpdated ? "Atualizar" : "Criar"}
        isOpen={disclosureFormModal.isOpen}
        onClose={() => {
          if (isUpdated) setIsUpdated(false);
          disclosureFormModal.onClose(), reset({});
        }}
        onAction={() => {
          handleSubmit(updateCompanyById)();
        }}
      >
        <FormProvider {...formCompany}>
          <CompanyForm />
        </FormProvider>
      </ModalDialog>
    );
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        description={findCompanyById?.fantasia}
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => removeCompany(companyId)}
      />
    );
  };

  return (
    <Box>
      <Flex justifyContent="space-between" mb={8}>
        <Heading as="h3" fontSize={26}>
          Empresas
        </Heading>
        <Button
          bg="pink.300"
          color="gray.50"
          size="md"
          _hover={{
            bg: "pink.400",
          }}
          onClick={() => {
            reset({});
            disclosureFormModal.onOpen();
          }}
        >
          CRIAR EMPRESA
        </Button>
      </Flex>

      <DataTable
        columns={columns}
        data={allCompanies}
        onRowEdit={(row) => {
          disclosureFormModal.onOpen();
        }}
        onRowDelete={(row) => {
          setCompanyId(row.id);
          disclosureDestroyModal.onOpen();
        }}
      />

      {renderFormModal()}
      {renderDestroyModal()}
    </Box>
  );
}

export async function getServerSideProps() {
  const companies = await getCompanies();

  if (!companies) {
    return {
      notFound: true,
    };
  }

  return {
    props: { companies }, // will be passed to the page component as props
  };
}
