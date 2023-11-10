import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Box, Divider, Flex, Heading } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { searchAddressByCep } from "@/utils/searchAddressByCep";
import { CompanyFormData } from "@/schemas/CompanySchemaValidation";
import { Input } from "@/components/Input";
import { InputMask } from "@/components/Input/InputMask";
import { Select } from "@/components/Select";
import { states } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { unmaskText } from "@/utils/unmaskText";

export function CompanyForm() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CompanyFormData>();

  const cep = watch("ender_cep") || "";

  const debounceCep = useDebounce(unmaskText(cep), 1000);

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
        <Heading size="md">Dados da empresa</Heading>
        <Flex gap={4} alignItems="center">
          <InputMask
            mt={4}
            maxW="25%"
            mask="99.999.999/9999-99"
            label="CNPJ"
            placeholder="Ex: 33.674.645/0001-69"
            {...register("cnpj")}
            error={errors.cnpj}
            isRequired
          />

          <Input
            mt={4}
            maxW="25%"
            label="Fantasia"
            placeholder="Ex: Inplaka"
            {...register("fantasia")}
            error={errors.fantasia}
            isRequired
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
            error={errors.ender_complemento}
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
            error={errors.email}
            {...register("email")}
          />

          <InputMask
            mt={4}
            mask="(99) 9999-9999"
            label="Celular"
            placeholder="Ex: (99) 99999-9999"
            error={errors.celular}
            {...register("celular")}
          />

          <InputMask
            mt={4}
            mask="(99) 9999-9999"
            label="Telefone"
            placeholder="Ex: (99) 9999-9999"
            error={errors.telefone1}
            {...register("telefone1")}
          />

          <InputMask
            mt={4}
            mask="(99) 9999-9999"
            label="Telefone 2"
            placeholder="Ex: (99) 9999-9999"
            error={errors.telefone2}
            {...register("telefone2")}
          />
        </Flex>
      </Box>
    </form>
  );
}
