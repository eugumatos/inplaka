import {
  AsyncSelect as AsyncSelectChakra,
  chakraComponents,
} from "chakra-react-select";
import { Controller, Control } from "react-hook-form";

interface AsycnSelectProps {
  placeHolder?: string;
  loadOptions: any;
  name: string;
  control: Control<any>;
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
  name,
  control,
  placeHolder,
  loadOptions,
}: AsycnSelectProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <AsyncSelectChakra
          {...field}
          components={asyncComponents}
          loadOptions={loadOptions}
          placeholder={placeHolder || "Selecione uma opção"}
          defaultOptions
          cacheOptions
        />
      )}
    />
  );
};
