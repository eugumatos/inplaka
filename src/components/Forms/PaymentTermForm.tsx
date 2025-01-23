import { PaymentTermFormData } from "@/schemas/PaymentTermSchemaValidation";
import { Box, Heading } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

export function PaymentTermForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PaymentTermFormData>();

  return (
    <form>
      <Box mt={10}>
        <Heading size="md">Editar permissão</Heading>
      </Box>
    </form>
  );
}
