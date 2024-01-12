import { FormProvider, useForm } from "react-hook-form";
import { getProducts } from "@/services/product";
import { yupResolver } from "@hookform/resolvers/yup";

import { Product } from "@/containers/Product";
import { ProductProvider } from "@/contexts/ProductContext";
import {
  ProductFormData,
  productFormSchema,
} from "@/schemas/ProductSchemaValidation";
import { IProduct } from "@/domains/product";

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

export async function getServerSideProps() {
  const products = await getProducts();

  if (!products) {
    return {
      notFound: true,
    };
  }

  return {
    props: { products }, // will be passed to the page component as props
  };
}
