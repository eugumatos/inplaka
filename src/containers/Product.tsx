import { useProducts } from "@/contexts/ProductContext";
import { ProductFormData, ProductFormByClientData } from "@/schemas/ProductSchemaValidation";
import { Box, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { Column } from "react-table";

import { ProductForm } from "@/components/Forms/ProductForm";
import { ModalDialog } from "@/components/Modals";
import { DestroyModal } from "@/components/Modals/DestroyModal";
import { DataTable } from "@/components/Table";

import { IProduct } from "@/domains/product";
import { filterText } from "@/utils/filterText";
import { upper } from "@/utils/upper";
import { ProductByClientForm } from "@/components/Forms/ProductByClientForm";

export function Product() {
  const { 
    products, 
    isLoading, 
    addProduct, 
    editProduct, 
    editProductByClient, 
    removeProduct 
  } = useProducts();

  const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);

  const { handleSubmit, reset, setValue, formState } =
    useFormContext<ProductFormData>();

  const hasErrors = formState.isValid;
  
  const formProductByClient = useForm<ProductFormByClientData>();

  const disclosureFormCreateModal = useDisclosure();
  const disclosureFormEditModal = useDisclosure();
  const disclosureDestroyModal = useDisclosure();
  const disclosureCustomModal = useDisclosure();

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Descrição",
        accessor: "descricao",
        Cell: ({ value }) => filterText(upper(value), 30),
      },
      {
        Header: "Controlar estoque",
        accessor: "controlar_estoque",
        Cell: ({ value }) => (value ? "SIM" : "NÃO"),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => filterText(upper(value), 55),
      },
    ],
    []
  );

  const seekCurrentProduct = (product: IProduct) => {
    const findProduct = products.find((p) => product.id === p.id);

    if (findProduct) {
      setCurrentProduct(findProduct);
    }
  };

  const renderFormCreateModal = () => {
    return (
      <ModalDialog
        maxWidth="70%"
        textAction="Criar"
        isOpen={disclosureFormCreateModal.isOpen}
        onClose={disclosureFormCreateModal.onClose}
        onAction={() => {
          handleSubmit(addProduct)();

          if (hasErrors) {
            disclosureFormCreateModal.onClose();
          }
        }}
      >
        <ProductForm />
      </ModalDialog>
    );
  };

  const renderFormEditModal = () => {
    return (
      <ModalDialog
        maxWidth="70%"
        textAction="Editar"
        isOpen={disclosureFormEditModal.isOpen}
        onClose={disclosureFormEditModal.onClose}
        onAction={() => {
          handleSubmit(editProduct)();

          if (hasErrors) {
            disclosureFormEditModal.onClose();
          }
        }}
      >
        <ProductForm isUpdate />
      </ModalDialog>
    );
  };

  const renderDestroyModal = () => {
    return (
      <DestroyModal
        isOpen={disclosureDestroyModal.isOpen}
        onClose={disclosureDestroyModal.onClose}
        onAction={() => {
          if (currentProduct) {
            removeProduct(currentProduct);
          }

          disclosureDestroyModal.onClose();
        }}
      />
    );
  };

  return (
    <Box w="100%" flex={1}>
      <Flex justifyContent="space-between" mb={8}>
        <Heading as="h3" fontSize={26}>
          Produtos
        </Heading>
        <Button
          bg="pink.300"
          color="gray.50"
          size="md"
          onClick={() => {
            reset();
            disclosureFormCreateModal.onOpen();
          }}
          _hover={{
            bg: "pink.400",
          }}
        >
          CRIAR PRODUTO
        </Button>
      </Flex>

      <DataTable
        isLoading={isLoading}
        columns={columns}
        data={products}
        onRowEdit={(row) => {
          Object.keys(row).forEach((key: any) => {
            return setValue(key, row[key]);
          });

          disclosureFormEditModal.onOpen();
        }}
        onRowDelete={(row) => {
          seekCurrentProduct(row);
          disclosureDestroyModal.onOpen();
        }}
      />

      {renderFormCreateModal()}
      {renderFormEditModal()}

      {renderDestroyModal()}
    </Box>
  );
}
