import { HStack, Input, Button, useNumberInput } from "@chakra-ui/react";

interface InputQuantity {
  maxW?: string;
}

export function InputQuantity({ maxW }: InputQuantity) {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      defaultValue: 0,
      min: 1,
      max: 999,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <HStack maxW={maxW}>
      <Button {...inc}>+</Button>
      <Input placeholder="Qtd" {...input} />
      <Button {...dec}>-</Button>
    </HStack>
  );
}
