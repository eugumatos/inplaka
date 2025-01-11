import { getAccounts } from "@/services/account";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { Account } from "@/containers/Account";
import { AccountProvider } from "@/contexts/AccountContext";
import { IAccount } from "@/domains/account";
import {
  AccountFormData,
  accountFormSchema,
} from "@/schemas/AccountSchemaValidation";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

interface AccountProps {
  accounts: IAccount[];
}

export default function Conta({ accounts }: AccountProps) {
  const account = useForm<AccountFormData>({
    resolver: yupResolver(accountFormSchema),
  });

  return (
    <AccountProvider accounts={accounts}>
      <FormProvider {...account}>
        <Account />
      </FormProvider>
    </AccountProvider>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const accounts = await getAccounts();

  if (!accounts) {
    return {
      notFound: true,
    };
  }

  return {
    props: { accounts }, // will be passed to the page component as props
  };
});
