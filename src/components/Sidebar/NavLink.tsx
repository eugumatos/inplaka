import {
  Icon,
  Link as ChakraLink,
  Text,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import { ElementType } from "react";
import { ActiveLink } from "../ActiveLink";

interface NavLinkProps extends ChakraLinkProps {
  icon: ElementType;
  children: string;
  href: string;
}

export function NavLink({ icon, children, href, ...rest }: NavLinkProps) {
  return (
    <ActiveLink href={href} shouldMatchExactHref passHref>
      <ChakraLink display="flex" align="center" {...rest}>
        <Icon as={icon} color="blue.200" fontSize="20" />
        <Text ml="4">{children}</Text>
      </ChakraLink>
    </ActiveLink>
  );
}
