import { FormProvider, useForm } from "react-hook-form";
import { getAccounts } from "@/services/account";
import { yupResolver } from "@hookform/resolvers/yup";

import { Account } from "@/containers/Account";
import { AccountProvider } from "@/contexts/AccountContext";
import {
  AccountFormData,
  accountFormSchema,
} from "@/schemas/AccountSchemaValidation";
import { IAccount } from "@/domains/account";

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

export async function getServerSideProps() {
  const accounts = await getAccounts();

  if (!accounts) {
    return {
      notFound: true,
    };
  }

  return {
    props: { accounts }, // will be passed to the page component as props
  };
}
