import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Box, Divider, Flex, Heading, FormLabel } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { searchAddressByCep } from "@/utils/searchAddressByCep";
import { ClientFormData } from "@/schemas/ClientSchemaValidation";
import { useClients } from "@/contexts/ClientContext";
import { Input } from "@/components/Input";
import { InputMask } from "@/components/Input/InputMask";
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { Select } from "@/components/Select";
import { states } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { unmaskText } from "@/utils/unmaskText";

export function ClientForm() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useFormContext<ClientFormData>();

  const { sellerOptions } = useClients();

  const cep = watch("ender_cep") || "";

  const debounceCep = useDebounce(unmaskText(cep), 1000);

  console.log(errors);

  useEffect(() => {
    async function searchAdress() {
      try {
        const response = await searchAddressByCep(debounceCep);

        if (!response.uf) {
          throw new Error();
        }

        setValue("ender_uf", response.uf);
        setValue("ender_bairro", response.bairro);
        setValue("ender_cidade", response.localidade);
        setValue("ender_logradouro", response.logradouro);
      } catch (error) {
        toast.warning("CEP não encontrado!");
      }
    }

    if (debounceCep) searchAdress();
  }, [debounceCep, setValue]);

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Dados do cliente</Heading>
        <Flex gap={4} alignItems="center">
          <InputMask
            mt={4}
            maxW="25%"
            mask="99.999.999/9999-99"
            label="CNPJ"
            placeholder="Ex: 33.674.645/0001-69"
            {...register("cnpj")}
            error={errors.cnpj}
          />

          <InputMask
            mt={4}
            maxW="25%"
            mask="99.999.999-*"
            label="IE"
            placeholder="Ex: 27.497.627-4"
            {...register("rg_ie")}
          />

          <Input
            mt={4}
            label="Razão Social"
            placeholder="Ex: Inplaka Ltda"
            {...register("razao_social")}
            error={errors.razao_social}
            isRequired
          />
        </Flex>

        <Flex gap={4}>
          <Input
            mt={4}
            label="Nome"
            placeholder="Ex: Inplaka Ltda"
            {...register("nome")}
            error={errors.nome}
            isRequired
          />
          <Input
            mt={4}
            label="Apelido"
            placeholder="Ex: Inplaka "
            {...register("apelido")}
            error={errors.apelido}
            isRequired
          />
        </Flex>

        <Flex gap={4}>
          <Input
            mt={4}
            flex={1}
            label="Matrícula"
            placeholder="Ex: 23121"
            {...register("matricula")}
          />
          <Box mt={4} minW="30%" maxW="40%">
            <FormLabel>Vendedor:</FormLabel>
            <AsyncSelect
              control={control}
              loadOptions={sellerOptions}
              {...register("vendedorPadrao")}
            />
          </Box>
          <Select
            mt={4}
            maxW="20%"
            label="Consumidor final"
            defaultOption="SIM"
            {...register("consumidor_final")}
          >
            <option value={"true"}>SIM</option>
            <option value={"false"}>NÃO</option>
          </Select>
          <Select
            mt={4}
            label="Status"
            maxW="20%"
            defaultOption="ATIVO"
            {...register("status")}
          >
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </Select>
        </Flex>
      </Box>

      <Divider my={3} orientation="horizontal" />

      <Box>
        <Heading size="md">Endereço</Heading>
        <Flex gap={4} alignItems="center">
          <InputMask
            mt={4}
            maxW="20%"
            mask="99.999-999"
            label="CEP"
            placeholder="Ex: 99.999-999"
            error={errors.ender_cep}
            {...register("ender_cep")}
          />

          <Input
            mt={4}
            label="Cidade"
            placeholder="Ex: São Paulo"
            error={errors.ender_cidade}
            {...register("ender_cidade")}
          />

          <Input
            mt={4}
            label="Bairro"
            placeholder="Ex: Vila Mariana"
            error={errors.ender_bairro}
            {...register("ender_bairro")}
          />
        </Flex>

        <Flex gap={4} alignItems="center">
          <Input
            mt={4}
            maxW="35%"
            label="Logradouro"
            placeholder="Ex: Rua Vergueiro"
            error={errors.ender_logradouro}
            {...register("ender_logradouro")}
          />

          <Input
            mt={4}
            label="Complemento"
            placeholder="Ex: Apto 10"
            {...register("ender_complemento")}
          />

          <Input
            mt={4}
            type="number"
            maxW="12%"
            label="Número"
            placeholder="Ex: 1265"
            error={errors.ender_numero}
            {...register("ender_numero")}
          />

          <Select
            mt={4}
            maxW="10%"
            label="UF"
            defaultOption="Ex: SP"
            {...register("ender_uf")}
          >
            {states.map((state) => (
              <option key={state.uf} value={state.uf}>
                {state.uf}
              </option>
            ))}
          </Select>
        </Flex>
      </Box>

      <Divider my={3} orientation="horizontal" />

      <Box>
        <Heading size="md">Contato</Heading>
        <Flex gap={4} alignItems="center">
          <Input
            mt={4}
            type="email"
            label="Email"
            placeholder="Ex: inplaka@email.com"
            {...register("email")}
          />

          <InputMask
            mt={4}
            mask="(99) 9999-9999"
            label="Celular"
            placeholder="Ex: (99) 99999-9999"
            {...register("celular")}
          />

          <InputMask
            mt={4}
            mask="(99) 9999-9999"
            label="Telefone"
            placeholder="Ex: (99) 9999-9999"
            {...register("telefone1")}
          />

          <InputMask
            mt={4}
            mask="(99) 9999-9999"
            label="Telefone 2"
            placeholder="Ex: (99) 9999-9999"
            {...register("telefone2")}
          />
        </Flex>
      </Box>
    </form>
  );
}
