import { AuthContext } from "@/contexts/AuthContext";
import { withSSRGuest } from "@/utils/hoc/withSSRGuest";
import { Button, Flex, Heading, Stack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { Input } from "../components/Input";

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormSchema = yup.object().shape({
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: yup.string().required("Senha obrigatória"),
});

export default function SingIn() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema),
  });

  const { errors } = formState;

  const { signIn } = useContext(AuthContext);

  const handleSignIn: SubmitHandler<SignInFormData> = async (data) => {
    await signIn(data);
  };

  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        width="100%"
        maxWidth={460}
        bg="white"
        p="10"
        borderRadius={14}
        flexDir="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Heading as="h3" size="lg" textAlign="center" marginBottom={5}>
          Central Placas
        </Heading>
        <Stack spacing="4">
          <Input
            type="text"
            label="E-mail"
            error={errors.email}
            {...register("email")}
          />
          <Input
            type="password"
            error={errors.password}
            label="Senha"
            {...register("password")}
          />
        </Stack>

        <Button
          type="submit"
          mt="6"
          size="md"
          colorScheme="pink"
          isLoading={formState.isSubmitting}
        >
          Entrar
        </Button>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
