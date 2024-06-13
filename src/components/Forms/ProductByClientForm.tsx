import { useFormContext } from "react-hook-form";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { ProductFormByClientData } from "@/schemas/ProductSchemaValidation";
import { InputCurrency } from "@/components/Input/InputCurrency";
import { Input } from "@/components/Input";
import { AsyncSelect } from "@/components/Select/AsyncSelect";
import { getProduct, getProducts } from "@/services/product";
import { currency } from "@/utils/currency";

import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export function ProductByClientForm() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ProductFormByClientData>();
  
  const [currectProductPrice, setCurrentProductPrice] = useState<string>(''); 

  const currentProductOption = watch('produto') as any;

  const productOptions = async (value: string) => {
    try {
      const products = await getProducts();

      const options = products
        .map((product) => ({
          value: product.id,
          label: product.descricao
        }))
        .filter((item) =>
          item.label.toLocaleUpperCase().includes(value.toUpperCase())
        );

      return options;
    } catch (error) {
      toast.warning("Erro ao carregar produtos");

      return [];
    }
  };

  useEffect(() => {
    async function searchProduct() {
      try {
        if (currentProductOption?.value) {
          const product = await getProduct(currentProductOption.value);
    
          setCurrentProductPrice(currency(+product.valor_venda));
        }
      } catch (error) {
        toast.error('Erro ao carregar preço do atual deste produto.')
      }
    }

    currentProductOption?.value && searchProduct();
  },[currentProductOption?.value])

  return (
    <form style={{ minHeight: '400px' }}>
      <Box mt={10}>
        <Heading size="md">Dados</Heading>
        <Flex gap={4} alignItems="center" wrap="wrap">
          <Flex direction="column" flex={1} gap={2}>
            <AsyncSelect
              label="Produto"
              control={control}
              loadOptions={productOptions}
              value={currentProductOption}
              error={errors.produto?.label}
              {...register("produto")}
            />
          </Flex>
          <Flex direction="column" flex={1} gap={2}>
            <Flex gap={2}>
              <Text>Valor venda </Text>
              <Text color="red.500">*</Text>
            </Flex>
            <InputCurrency
              mt={2}
              value={currectProductPrice}
              name="valor_venda"
              placeholder="R$ 5.000"
              control={control}
              error={errors.valor_venda}
              isDisabled
            />
          </Flex>
          <Flex direction="column" flex={1} gap={2}>
            <Flex gap={2}>
              <Text>Valor venda cliente</Text>
              <Text color="red.500">*</Text>
            </Flex>
            <InputCurrency
              mt={2}
              name="valor_venda_cliente"
              placeholder="R$ 5.000"
              control={control}
              error={errors.valor_venda}
            />
          </Flex>
        </Flex>
      </Box>
    </form>
  );
}
