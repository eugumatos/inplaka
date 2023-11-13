import { FormProvider, useForm } from "react-hook-form";
import { getCompanies } from "@/services/company";
import { yupResolver } from "@hookform/resolvers/yup";

import { ICompany } from "@/domains/company";
import {
  CompanyFormData,
  companyFormSchema,
} from "@/schemas/CompanySchemaValidation";
import { Company } from "@/containers/Company";
import { CompanyProvider } from "@/contexts/CompanyContext";

interface HomeProps {
  companies: ICompany[];
}

export default function Home({ companies }: HomeProps) {
  const formCompany = useForm<CompanyFormData>({
    resolver: yupResolver(companyFormSchema),
  });

  return (
    <CompanyProvider companies={companies}>
      <FormProvider {...formCompany}>
        <Company />
      </FormProvider>
    </CompanyProvider>
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
