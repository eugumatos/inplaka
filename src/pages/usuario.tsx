import { getUsers } from "@/services/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { User } from "@/containers/User";
import { UserProvider } from "@/contexts/UserContext";
import { IUser } from "@/domains/user";
import { UserFormData, userFormSchema } from "@/schemas/UserSchemaValidation";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

interface UserProps {
  users: IUser[];
}

export default function Usuario({ users }: UserProps) {
  const user = useForm<UserFormData>({
    resolver: yupResolver(userFormSchema),
  });

  return (
    <UserProvider users={users}>
      <FormProvider {...user}>
        <User />
      </FormProvider>
    </UserProvider>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const users = await getUsers(ctx);

  if (!users) {
    return {
      notFound: true,
    };
  }

  return {
    props: { users },
  };
});
