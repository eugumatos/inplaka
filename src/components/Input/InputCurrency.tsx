import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { Controller, FieldError } from "react-hook-form";
import { NumericFormat } from "react-number-format";

interface InputCurrencyBaseProps
  extends Omit<InputProps, "type" | "defaultValue"> {
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
        name={name}
        render={({ field: { onChange, value } }) => (
          <>
            {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
            <NumericFormat
              customInput={Input}
              getInputRef={ref} // Passa a ref corretamente
              name={name}
              value={value ?? ""} // Garante que seja string ou vazio
              onValueChange={(values) => {
                const numericValue = values.floatValue ?? null;
                if (
                  !maxValue ||
                  (numericValue !== null && numericValue <= maxValue)
                ) {
                  onChange(numericValue);
                }
              }}
              prefix="R$ "
              color="gray.800"
              borderColor="gray.100"
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              decimalScale={2}
              fixedDecimalScale
              {...rest}
            />
          </>
        )}
      />

      {!!error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const InputCurrency = forwardRef(InputCurrencyBase);
