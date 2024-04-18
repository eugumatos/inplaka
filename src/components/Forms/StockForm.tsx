import { Box, Flex, Heading } from "@chakra-ui/react";
import { InputQuantity } from "@/components/Input/InputQuantity";
import { useFormContext } from "react-hook-form";
import { StockFormData } from "@/schemas/StockSchemaValidation";

export function StockForm() {
  const { register, setValue, getValues } = useFormContext<StockFormData>();

  const { produtoNome } = getValues();

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Produto: {produtoNome}</Heading>
        <Flex gap={4} mt={8} alignItems="center" justify="center" wrap="wrap">
          <InputQuantity
            maxW="40%"
            onChangeQuantity={(value) => setValue("quantidade", value)}
            {...register("quantidade")}
          />
        </Flex>
      </Box>
    </form>
  );
}
