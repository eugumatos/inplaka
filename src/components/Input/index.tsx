import { forwardRef, ForwardRefRenderFunction } from "react";
import {
  Input as InputChakra,
  InputProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { FieldError } from "react-hook-form";

interface InputBaseProps extends InputProps {
  name: string;
  mt?: number;
  maxW?: string;

  label?: string;
  error?: FieldError;
  defaultValue?: string;
  isRequired?: boolean;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputBaseProps> = (
  { name, isRequired, defaultValue, error, label, maxW, mt, ...rest },
  ref
) => {
  const calculateMarginB = mt && mt + 2;

  return (
    <FormControl
      mt={mt}
      mb={!!error ? 0 : calculateMarginB}
      maxW={maxW}
      isRequired={isRequired}
      isInvalid={!!error}
    >
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <InputChakra
        name={name}
        color="gray.800"
        borderColor="gray.100"
        ref={ref}
        {...rest}
      />
      {!!error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
