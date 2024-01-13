import { useMemo } from "react";
import { GetServerSideProps } from "next";
import { Box, Container, Heading } from "@chakra-ui/react";
import { DataTable } from "@/components/Table";
import { Column } from "react-table";
import { getOrder } from "@/services/order";

interface PlacasProps {
  id: string;
}

export default function Placas({ id }: PlacasProps) {
  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Placa",
        accessor: "descricao",
      },
    ],
    []
  );

  return (
    <Container maxW={1480} p={10}>
      <Heading size="lg" mb={6}>
        Lista de placas {id}
      </Heading>

      <DataTable columns={columns} data={[]} />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { id }: any = params;

  const response = await getOrder(String(id));

  console.log(response);

  if (!response) {
    return {
      redirect: {
        destination: "/pedido",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id,
    },
  };
};
