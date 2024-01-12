import { Stack } from "@chakra-ui/react";
import {
  RiUser3Line,
  RiDashboardLine,
  RiBuilding2Line,
  RiContactsLine,
  RiMindMap,
  RiAccountPinBoxLine,
  RiStoreLine,
  RiProductHuntLine,
  RiShoppingCartLine,
  RiBankCard2Line,
  RiUserSharedLine,
  RiServiceLine,
} from "react-icons/ri";

import { NavSection } from "./NavSection";
import { NavLink } from "./NavLink";

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start">
      <NavSection title="ADMIN">
        <NavLink href="/" icon={RiDashboardLine} color="gray.500">
          Dashboard
        </NavLink>
        <NavLink href="/users" icon={RiContactsLine}>
          Usuários
        </NavLink>
      </NavSection>
      <NavSection title="GERAL">
        <NavLink href="/empresa" icon={RiBuilding2Line}>
          Empresas
        </NavLink>
        <NavLink href="/automation" icon={RiAccountPinBoxLine}>
          Contas
        </NavLink>
        <NavLink href="/automation" icon={RiUser3Line}>
          Clientes
        </NavLink>
        <NavLink href="/automation" icon={RiStoreLine}>
          Vendedores
        </NavLink>
        <NavLink href="/automation" icon={RiUserSharedLine}>
          Fornecedores
        </NavLink>
        <NavLink href="/automation" icon={RiProductHuntLine}>
          Produtos
        </NavLink>
        <NavLink href="/servico" icon={RiServiceLine}>
          Serviços
        </NavLink>
        <NavLink href="/forma-pagamento" icon={RiBankCard2Line}>
          Formas de Pagamento
        </NavLink>
        <NavLink href="/automation" icon={RiMindMap}>
          Condições de Pagamento
        </NavLink>
        <NavLink href="/pedido" icon={RiShoppingCartLine}>
          Pedidos de Venda
        </NavLink>
      </NavSection>
    </Stack>
  );
}
