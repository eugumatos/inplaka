import { useState, forwardRef, ForwardRefRenderFunction } from "react";
import { useFormContext } from "react-hook-form";
import {
  HStack,
  Input,
  InputProps,
  Button,
  useNumberInput,
} from "@chakra-ui/react";
import { toast } from "react-toastify";

interface InputQuantity extends InputProps {
  name: string;
  maxQ?: number;
  maxW?: string;
  onChangeQuantity?: (value: number) => void;
}

const InputQuantityBase: ForwardRefRenderFunction<
  HTMLInputElement,
  InputQuantity
> = ({ name, maxQ = 999, maxW, onChangeQuantity, ...rest }, ref) => {
  const validateQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) > maxQ) {
      toast.warning("Quantidade indisponível!");
    }
  };

  const {
    isDisabled,
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
  } = useNumberInput({
    name,
    min: 0,
    max: maxQ,
    defaultValue: 0,
    isDisabled: maxQ === 0 || !!maxQ === false,
    onBlur: validateQuantity,
    onChange: (valueAsString, valueAsNumber) =>
      onChangeQuantity && onChangeQuantity(valueAsNumber),
  });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();

  const input = getInputProps();

  return (
    <HStack maxW={maxW}>
      <Button isDisabled={isDisabled} {...inc}>
        +
      </Button>
      <Input {...input} {...rest} placeholder="Qtd" ref={ref} />
      <Button isDisabled={isDisabled} {...dec}>
        -
      </Button>
    </HStack>
  );
};

export const InputQuantity = forwardRef(InputQuantityBase);
