import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import {
  AsyncSelect as AsyncSelectChakra,
  chakraComponents,
} from "chakra-react-select";
import { Controller, Control, FieldError } from "react-hook-form";

export interface SelectProps {
  value: string;
  label: string;
}

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
  value?: SelectProps;
  isDisabled?: boolean;
  onChangeOption?: (option: SelectProps) => void;
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
  value,
  isRequired,
  placeHolder,
  loadOptions,
  onChangeOption,
  isDisabled = false,
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
            isDisabled={isDisabled}
            ref={field.ref}
            className="async-select-props"
            components={asyncComponents}
            loadOptions={loadOptions}
            value={value}
            placeholder={placeHolder || "Selecione uma opção"}
            getOptionValue={(option: any) => option.value}
            getOptionLabel={(option: any) => option.label}
            onChange={(e: any) => {
              onChangeOption && onChangeOption(e);
              field.onChange(e);
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
