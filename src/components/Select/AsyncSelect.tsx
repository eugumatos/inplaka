import {
  AsyncSelect as AsyncSelectChakra,
  chakraComponents,
} from "chakra-react-select";

interface AsycnSelectProps {
  placeHolder?: string;
  loadOptions: any;
  name: string;
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
  placeHolder,
  loadOptions,
}: AsycnSelectProps) => (
  <AsyncSelectChakra
    name={name}
    components={asyncComponents}
    loadOptions={loadOptions}
    placeholder={placeHolder || "Selecione uma opção"}
    defaultOptions
    cacheOptions
  />
);
