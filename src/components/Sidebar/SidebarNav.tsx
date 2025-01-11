import { Stack } from "@chakra-ui/react";
import { BsSignpost } from "react-icons/bs";
import {
  RiAccountPinBoxLine,
  RiBankCard2Line,
  RiBillLine,
  RiBox3Line,
  RiBuilding2Line,
  RiContactsLine,
  RiDashboardLine,
  RiFundsBoxLine,
  RiGovernmentLine,
  RiMindMap,
  RiProductHuntLine,
  RiServiceLine,
  RiShoppingCartLine,
  RiStoreLine,
  RiUser3Line,
  RiUserSharedLine,
} from "react-icons/ri";

import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import { Can } from "../Can";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

export function SidebarNav() {
  const { user } = useContext(AuthContext);

  const hasPermissions = (requiredPermissions: string[]) => {
    return requiredPermissions.some((permission) =>
      user?.permissions.includes(permission)
    );
  };

  return (
    <Stack spacing="12" align="flex-start" mb={5}>
      {hasPermissions(["/", "/usuario"]) && (
        <NavSection title="ADMIN">
          <Can permissions={["/"]}>
            <NavLink href="/" icon={RiDashboardLine} color="gray.500">
              Dashboard
            </NavLink>
          </Can>
          <Can permissions={["/usuario"]}>
            <NavLink href="/usuario" icon={RiContactsLine}>
              Usuários
            </NavLink>
          </Can>
        </NavSection>
      )}

      {hasPermissions([
        "/empresa",
        "/conta",
        "/cliente",
        "/vendedor",
        "/fornecedor",
        "/produto",
        "/servico",
        "/forma-pagamento",
        "/condicao-pagamento",
      ]) && (
        <NavSection title="GERAL">
          <Can permissions={["/empresa"]}>
            <NavLink href="/empresa" icon={RiBuilding2Line}>
              Empresas
            </NavLink>
          </Can>
          <Can permissions={["/conta"]}>
            <NavLink href="/conta" icon={RiAccountPinBoxLine}>
              Contas
            </NavLink>
          </Can>
          <Can permissions={["/cliente"]}>
            <NavLink href="/cliente" icon={RiUser3Line}>
              Clientes
            </NavLink>
          </Can>
          <Can permissions={["/vendedor"]}>
            <NavLink href="/vendedor" icon={RiStoreLine}>
              Vendedores
            </NavLink>
          </Can>
          <Can permissions={["/fornecedor"]}>
            <NavLink href="/fornecedor" icon={RiUserSharedLine}>
              Fornecedores
            </NavLink>
          </Can>
          <Can permissions={["/produto"]}>
            <NavLink href="/produto" icon={RiProductHuntLine}>
              Produtos
            </NavLink>
          </Can>
          <Can permissions={["/servico"]}>
            <NavLink href="/servico" icon={RiServiceLine}>
              Serviços
            </NavLink>
          </Can>
          <Can permissions={["/forma-pagamento"]}>
            <NavLink href="/forma-pagamento" icon={RiBankCard2Line}>
              Formas de Pagamento
            </NavLink>
          </Can>
          <Can permissions={["/condicao-pagamento"]}>
            <NavLink href="/condicao-pagamento" icon={RiMindMap}>
              Condições de Pagamento
            </NavLink>
          </Can>
        </NavSection>
      )}

      {hasPermissions([
        "/pedido",
        "/baixa-pedido",
        "/contas-pagar",
        "/baixa-contas",
        "/estoque",
      ]) && (
        <NavSection title="PEDIDOS">
          <Can permissions={["/pedido"]}>
            <NavLink href="/pedido" icon={RiShoppingCartLine}>
              Pedidos de Venda
            </NavLink>
          </Can>
          <Can permissions={["/baixa-pedido"]}>
            <NavLink href="/baixa-pedido" icon={BsSignpost}>
              Baixa de pedidos
            </NavLink>
          </Can>
          <Can permissions={["/contas-pagar"]}>
            <NavLink href="/contas-pagar" icon={RiBillLine}>
              Contas a pagar
            </NavLink>
          </Can>
          <Can permissions={["/baixa-contas"]}>
            <NavLink href="/baixa-contas" icon={RiBillLine}>
              Baixa contas
            </NavLink>
          </Can>
          <Can permissions={["/estoque"]}>
            <NavLink href="/estoque" icon={RiBox3Line}>
              Estoque
            </NavLink>
          </Can>
        </NavSection>
      )}

      {hasPermissions(["/vendas", "/caixa"]) && (
        <NavSection title="RELATÓRIOS">
          <Can permissions={["/vendas"]}>
            <NavLink href="/vendas" icon={RiFundsBoxLine}>
              Vendas
            </NavLink>
          </Can>
          <Can permissions={["/caixa"]}>
            <NavLink href="/caixa" icon={RiGovernmentLine}>
              Caixa
            </NavLink>
          </Can>
        </NavSection>
      )}
    </Stack>
  );
}
