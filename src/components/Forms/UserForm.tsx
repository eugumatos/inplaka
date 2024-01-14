import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { UserFormData } from "@/schemas/UserSchemaValidation";
import {
  Box,
  Flex,
  Heading,
  InputGroup,
  Input as InputChakra,
  InputRightElement,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { useFormContext } from "react-hook-form";
import { userRoleTitle } from "@/contexts/UserContext";

interface UserFormProps {
  isUpdate?: boolean;
}

export function UserForm({ isUpdate }: UserFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<UserFormData>();

  const { isOpen, onToggle } = useDisclosure();

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
            <Select label="Cargo" error={errors.role} {...register("role")}>
              <option value={userRoleTitle.ADMINISTRADOR}>ADMINISTRADOR</option>
              <option value={userRoleTitle.VENDEDOR}>VENDEDOR</option>
              <option value={userRoleTitle.FINANCEIRO}>FINANCEIRO</option>
              <option value={userRoleTitle.BACKOFFICE}>BACKOFFICE</option>
            </Select>
          </Box>
        </Flex>
      </Box>
    </form>
  );
}
