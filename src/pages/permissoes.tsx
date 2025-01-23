import { PermissionsContainer } from "@/containers/Permissions";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { IPermissions } from "@/domains/permissions";
import { getAllPermissions } from "@/services/permissions";
import { withSSRAuth } from "@/utils/hoc/withSSRAuth";

export default function Permissions({
  permissions,
}: {
  permissions: IPermissions[];
}) {
  return (
    <PermissionsProvider permissions={permissions}>
      <PermissionsContainer />
    </PermissionsProvider>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const permissions = await getAllPermissions();

  if (!permissions) {
    return {
      notFound: true,
    };
  }

  return {
    props: { permissions },
  };
});
