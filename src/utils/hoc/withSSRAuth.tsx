import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { destroyCookie, parseCookies } from "nookies";

type WithSSRAuthOptions = {
  permissions?: string[];
  roles?: string[];
};

export function withSSRAuth<P extends { [key: string]: any }>(
  fn: GetServerSideProps<P>,
  options?: WithSSRAuthOptions
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const token = cookies["nextauth.token"];

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    try {
      return await fn(ctx);
    } catch (error) {
      destroyCookie(ctx, "nextauth.token");
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  };
}
