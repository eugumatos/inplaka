import { FormProvider, useForm } from "react-hook-form";
import { getUsers } from "@/services/user";
import { yupResolver } from "@hookform/resolvers/yup";

import { User } from "@/containers/User";
import { UserProvider } from "@/contexts/UserContext";
import { UserFormData, userFormSchema } from "@/schemas/UserSchemaValidation";
import { IUser } from "@/domains/user";

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

export async function getServerSideProps() {
  const users = await getUsers();

  if (!users) {
    return {
      notFound: true,
    };
  }

  return {
    props: { users }, // will be passed to the page component as props
  };
}
