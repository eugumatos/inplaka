import { getCompanies } from "@/services/company";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { Company } from "@/containers/Company";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { ICompany } from "@/domains/company";
import {
  CompanyFormData,
  companyFormSchema,
} from "@/schemas/CompanySchemaValidation";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

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

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const companies = await getCompanies();

  if (!companies) {
    return {
      notFound: true,
    };
  }

  return {
    props: { companies }, // will be passed to the page component as props
  };
});
