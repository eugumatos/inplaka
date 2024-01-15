import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import {
  AsyncSelect as AsyncSelectChakra,
  AsyncProps,
  chakraComponents,
} from "chakra-react-select";
import { Controller, Control, FieldError } from "react-hook-form";

interface AsycnSelectProps {
  mt?: number;
  maxW?: string;
  placeHolder?: string;
  loadOptions: any;
  isRequired?: boolean;
  control: Control<any>;
  name: string;
  label?: string;
  error?: FieldError;
  onChangeOption?: (option: { value: string; label: string }) => void;
}

const asyncComponents = {
  LoadingIndicator: (props: any) => (
    <chakraComponents.LoadingIndicator
      color="currentColor"
      emptyColor="transparent"
      spinnerSize="md"
      speed="0.45s"
      thickness="2px"
      {...props}
    />
  ),
};

export const AsyncSelect = ({
  mt,
  maxW,
  name,
  error,
  control,
  label,
  isRequired,
  placeHolder,
  loadOptions,
  onChangeOption,
  ...rest
}: AsycnSelectProps) => {
  const calculateMarginB = mt && mt + 2;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormControl
          mt={mt}
          mb={!!error ? 0 : calculateMarginB}
          maxW={maxW}
          isRequired={isRequired}
          isInvalid={!!error}
        >
          <FormLabel>{label}</FormLabel>
          <AsyncSelectChakra
            ref={field.ref}
            components={asyncComponents}
            loadOptions={loadOptions}
            placeholder={placeHolder || "Selecione uma opção"}
            getOptionValue={(option: any) => option.value}
            getOptionLabel={(option: any) => option.label}
            onChange={(e) => {
              onChangeOption && onChangeOption(e);
              field.onChange(e?.value);
            }}
            defaultOptions
            cacheOptions
          />
          {!!error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
        </FormControl>
      )}
    />
  );
};
