import { forwardRef, ForwardRefRenderFunction } from "react";
import {
  Input,
  InputProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { NumericFormat } from "react-number-format";
import { Controller, FieldError } from "react-hook-form";

interface InputCurrencyBaseProps extends InputProps {
  mt?: number;
  maxW?: string;
  control: any;
  name: string;
  label?: string;
  error?: FieldError;
  isRequired?: boolean;
  maxValue?: number;
}

const InputCurrencyBase: ForwardRefRenderFunction<
  HTMLInputElement,
  InputCurrencyBaseProps
> = (
  { name, control, label, isRequired, error, maxW, mt, maxValue, ...rest },
  ref
) => {
  const calculateMarginB = mt && mt + 2;

  return (
    <FormControl
      mt={mt}
      mb={!!error ? 2 : calculateMarginB}
      maxW={maxW}
      isRequired={isRequired}
      isInvalid={!!error}
    >
      <Controller
        control={control}
        render={({ field: { onChange, name, value } }) => (
          <>
            {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
            <Input
              name={name}
              as={NumericFormat}
              value={value}
              onChange={(e) => {
                const numericValue = parseFloat(
                  e.target.value.replace(/[^\d.-]/g, "")
                );
                if (!maxValue || numericValue <= maxValue) {
                  onChange(e);
                }
              }}
              prefix="R$ "
              color="gray.800"
              borderColor="gray.100"
              thousandSeparator=","
              decimalSeparator="."
              {...rest}
            />
          </>
        )}
        name={name}
      />

      {!!error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const InputCurrency = forwardRef(InputCurrencyBase);
