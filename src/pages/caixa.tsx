import { CashFlow } from "@/containers/CashFlow";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

export default function Caixa() {
  return <CashFlow />;
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
