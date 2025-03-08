import { StockFormData } from "@/schemas/StockSchemaValidation";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "../Input";

export function StockForm() {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<StockFormData>();

  const { produtoNome, quantidade } = getValues();
  const [lastQtd, setLastQtd] = useState<number | null>(null);

  useEffect(() => {
    if (quantidade) setLastQtd(quantidade);
  }, []);

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Produto: {produtoNome}</Heading>
        <Flex gap={4} mt={8} direction="column" wrap="wrap">
          <Text>
            Saldo atual: <strong>{lastQtd}</strong>
          </Text>
          <Flex align="center" gap={4}>
            <Text>Quantas unidades deseja adicionar?</Text>
            <Input
              type="number"
              maxW="15%"
              placeholder="Ex: 5"
              {...register("quantidade")}
            />
          </Flex>
        </Flex>
      </Box>
    </form>
  );
}
