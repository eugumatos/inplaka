import { forwardRef, ForwardRefRenderFunction, ReactNode } from "react";
import {
  Select as SelectChakra,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FieldError } from "react-hook-form";

interface SelectBaseProps {
  mt?: number;
  maxW?: string;

  label?: string;
  children: ReactNode;
  isRequired?: boolean;
  error?: FieldError;
  defaultOption?: string;
}

const SelectBase: ForwardRefRenderFunction<
  HTMLSelectElement,
  SelectBaseProps
> = (
  { error, isRequired, defaultOption, label, maxW, mt, children, ...rest },
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
      <FormLabel>{label}</FormLabel>
      <SelectChakra
        borderColor="gray.100"
        color="gray.800"
        defaultValue={defaultOption}
        ref={ref}
        {...rest}
      >
        {!defaultOption && <option value="">Selecione uma opção</option>}
        {children}
      </SelectChakra>
      {!!error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Select = forwardRef(SelectBase);
