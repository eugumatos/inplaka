import { getProducts } from "@/services/product";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";

import { Product } from "@/containers/Product";
import { ProductProvider } from "@/contexts/ProductContext";
import { IProduct } from "@/domains/product";
import {
  ProductFormData,
  productFormSchema,
} from "@/schemas/ProductSchemaValidation";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

interface ProductProps {
  products: IProduct[];
}

export default function Produto({ products }: ProductProps) {
  const product = useForm<ProductFormData>({
    resolver: yupResolver(productFormSchema),
  });

  return (
    <ProductProvider products={products}>
      <FormProvider {...product}>
        <Product />
      </FormProvider>
    </ProductProvider>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const products = await getProducts();

  if (!products) {
    return {
      notFound: true,
    };
  }

  return {
    props: { products }, // will be passed to the page component as props
  };
});
