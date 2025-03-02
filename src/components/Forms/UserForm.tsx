import { Input } from "@/components/Input";
import { UserFormData } from "@/schemas/UserSchemaValidation";
import { getAllRoles } from "@/services/role";
import {
  Box,
  Flex,
  FormLabel,
  Heading,
  IconButton,
  Input as InputChakra,
  InputGroup,
  InputRightElement,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { AsyncSelect } from "../Select/AsyncSelect";

interface UserFormProps {
  isUpdate?: boolean;
}

export function UserForm({ isUpdate }: UserFormProps) {
  const {
    watch,
    control,
    register,
    formState: { errors },
  } = useFormContext<UserFormData>();

  const { isOpen, onToggle } = useDisclosure();

  const currentRole = watch("role") as any;

  console.log(currentRole);

  async function roleOptions(value: string) {
    try {
      const roles = await getAllRoles();
      const options = roles
        .map((role) => ({
          value: role.id,
          label: role.nome,
        }))
        .filter((item) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar fornecedores.");

      return [];
    }
  }

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Dados do usuário</Heading>
        <Flex gap={4} alignItems="center">
          <Input
            mt={4}
            label="Nome"
            type="text"
            placeholder="Ex:  Inplaka"
            {...register("name")}
            error={errors.name}
            isRequired
          />

          <Input
            mt={4}
            type="email"
            label="Email"
            placeholder="Ex: inplaka@email.com"
            {...register("email")}
            error={errors.email}
            isRequired
          />
        </Flex>

        <Flex gap={4} alignItems="center">
          <Box hidden={isUpdate} flex={1}>
            <Flex direction="column" gap={2}>
              <Flex flex={1} gap={1}>
                <Text>Senha </Text>
                <Text color="red.500">*</Text>
              </Flex>
              <InputGroup>
                <InputChakra
                  color="gray.800"
                  borderColor="gray.100"
                  type={isOpen ? "text" : "password"}
                  placeholder="Ex: Senha"
                  {...register("password")}
                />
                <InputRightElement>
                  <IconButton
                    bg="transparent"
                    aria-label="show-pass"
                    icon={isOpen ? <RiEyeOffFill /> : <RiEyeFill />}
                    onClick={onToggle}
                  />
                </InputRightElement>
              </InputGroup>
            </Flex>
          </Box>

          <Box flex={1} maxW="49%">
            <Flex>
              <FormLabel>Administrador</FormLabel>
              <Text color="red.500">*</Text>
            </Flex>
            <AsyncSelect
              control={control}
              loadOptions={roleOptions}
              value={currentRole}
              error={errors?.role?.label}
              {...register("role")}
            />
          </Box>
        </Flex>
      </Box>
    </form>
  );
}
