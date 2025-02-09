import { PermissionsContainer } from "@/containers/Permissions";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { IPermissions } from "@/domains/permissions";
import { getAllPermissions } from "@/services/permissions";

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

export const getServerSideProps = async () => {
  const permissions = await getAllPermissions();

  if (!permissions) {
    return {
      notFound: true,
    };
  }

  return {
    props: { permissions },
  };
};
