type User = {
  email: string;
  name: string;
  permissions: string[];
};

type ValidateUserPermissionsParams = {
  user: User | undefined;
  permissions?: string[];
  roles?: string[];
};

export function validateUserPermissions({
  user,
  permissions,
}: ValidateUserPermissionsParams) {
  if (permissions && permissions?.length > 0) {
    const hasAllPermissions = permissions.every((permission) => {
      return user?.permissions.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  return true;
}
