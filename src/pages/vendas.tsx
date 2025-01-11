import { Sales } from "@/containers/Sales";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

export default function Vendas() {
  return <Sales />;
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
