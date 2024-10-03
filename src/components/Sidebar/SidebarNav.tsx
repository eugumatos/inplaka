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
  RiBox3Line,
  RiFundsBoxLine,
  RiGovernmentLine,
  RiBillLine,
} from "react-icons/ri";
import { BsSignpost } from "react-icons/bs";

import { NavSection } from "./NavSection";
import { NavLink } from "./NavLink";

export function SidebarNav() {
  return (
    <Stack spacing="12" align="flex-start" mb={5}>
      <NavSection title="ADMIN">
        <NavLink href="/" icon={RiDashboardLine} color="gray.500">
          Dashboard
        </NavLink>
        <NavLink href="/usuario" icon={RiContactsLine}>
          Usuários
        </NavLink>
      </NavSection>
      <NavSection title="GERAL">
        <NavLink href="/empresa" icon={RiBuilding2Line}>
          Empresas
        </NavLink>
        <NavLink href="/conta" icon={RiAccountPinBoxLine}>
          Contas
        </NavLink>
        <NavLink href="/cliente" icon={RiUser3Line}>
          Clientes
        </NavLink>
        <NavLink href="/vendedor" icon={RiStoreLine}>
          Vendedores
        </NavLink>
        <NavLink href="/fornecedor" icon={RiUserSharedLine}>
          Fornecedores
        </NavLink>
        <NavLink href="/produto" icon={RiProductHuntLine}>
          Produtos
        </NavLink>
        <NavLink href="/servico" icon={RiServiceLine}>
          Serviços
        </NavLink>
        <NavLink href="/forma-pagamento" icon={RiBankCard2Line}>
          Formas de Pagamento
        </NavLink>
        <NavLink href="/condicao-pagamento" icon={RiMindMap}>
          Condições de Pagamento
        </NavLink>
      </NavSection>
      <NavSection title="PEDIDOS">
        <NavLink href="/pedido" icon={RiShoppingCartLine}>
          Pedidos de Venda
        </NavLink>

        <NavLink href="/baixa-pedido" icon={BsSignpost}>
          Baixa de pedidos
        </NavLink>

        <NavLink href="/contas-pagar" icon={RiBillLine}>
          Contas a pagar
        </NavLink>

        <NavLink href="/baixa-contas" icon={RiBillLine}>
          Baixa contas
        </NavLink>

        <NavLink href="/estoque" icon={RiBox3Line}>
          Estoque
        </NavLink>
      </NavSection>
      <NavSection title="RELATÓRIOS">
        <NavLink href="/vendas" icon={RiFundsBoxLine}>
          Vendas
        </NavLink>
        <NavLink href="/caixa" icon={RiGovernmentLine}>
          Caixa
        </NavLink>
      </NavSection>
    </Stack>
  );
}
