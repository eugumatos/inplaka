import { forwardRef, ForwardRefRenderFunction } from "react";
import {
  Input,
  InputProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import MaskedInput from "react-input-mask";
import { FieldError } from "react-hook-form";

interface InputMaskBaseProps extends InputProps {
  mt?: number;
  maxW?: string;

  mask: string;
  name: string;
  label?: string;
  error?: FieldError;
  isRequired?: boolean;
}

const InputMaskBase: ForwardRefRenderFunction<
  HTMLInputElement,
  InputMaskBaseProps
> = ({ mask, name, label, isRequired, error, maxW, mt, ...rest }, ref) => {
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
      <Input
        name={name}
        as={MaskedInput}
        mask={mask}
        maskChar={null}
        color="gray.800"
        borderColor="gray.100"
        ref={ref}
        {...rest}
      />

      {!!error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const InputMask = forwardRef(InputMaskBase);
