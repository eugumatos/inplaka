import {
  destroyRelation,
  getAllRoutes,
  getPermissionsById,
  updatePermissions,
} from "@/services/permissions";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "react-toastify";

interface Route {
  id: string;
  nome: string;
}

const ItemType = "ROUTE";

interface DraggableItemProps {
  item: Route;
}

function DraggableItem({ item }: DraggableItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <Box
      ref={drag}
      bg="blue.100"
      p={2}
      mb={2}
      color="white"
      borderRadius="md"
      opacity={isDragging ? 0.5 : 1}
      cursor="pointer"
    >
      {item.nome}
    </Box>
  );
}

interface DroppableAreaProps {
  title: string;
  items: Route[];
  onDrop: (item: Route) => void;
}

function DroppableArea({ title, items, onDrop }: DroppableAreaProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: Route) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <Box
      ref={drop}
      bg={isOver ? "gray.100" : "gray.50"}
      borderWidth="1px"
      borderRadius="md"
      p={4}
      w="45%"
      height="300px"
      overflowY="scroll"
    >
      <Heading size="sm" mb={4}>
        {title}
      </Heading>
      {items.length > 0 ? (
        items.map((item) => <DraggableItem key={item.id} item={item} />)
      ) : (
        <Text color="gray.500">Nenhuma rota aqui.</Text>
      )}
    </Box>
  );
}

export function PermissionForm({ id }: { id: string }) {
  const [accessibleRoutes, setAccessibleRoutes] = useState<Route[]>([]);
  const [inaccessibleRoutes, setInaccessibleRoutes] = useState<Route[]>([]);

  useEffect(() => {
    console.log("idRole", id);

    async function fetchData() {
      try {
        const allRoutes: Route[] = await getAllRoutes();

        const permissions = await getPermissionsById(id);

        const accessibleRouteIds = permissions.rotasPermitidas.map(
          (rota: { id: number }) => rota.id
        );

        console.log(permissions);

        const enhancedRoutes = allRoutes.map((route) => ({
          ...route,
        }));

        const accessible = enhancedRoutes.filter((route) =>
          accessibleRouteIds.includes(route.id)
        );
        const inaccessible = enhancedRoutes.filter(
          (route) => !accessibleRouteIds.includes(route.id)
        );

        setAccessibleRoutes(accessible);
        setInaccessibleRoutes(inaccessible);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    }

    fetchData();
  }, [id]);

  const handleDropInAccessible = async (item: Route) => {
    try {
      await updatePermissions({
        idRota: item.id,
        idRole: id,
      });

      setAccessibleRoutes((prev) => [...prev, item]);
      setInaccessibleRoutes((prev) =>
        prev.filter((route) => route.id !== item.id)
      );

      toast.success("Permissão editada com sucesso");
    } catch (error) {
      toast.error("Erro ao editar permissão");
    }
  };

  const handleDropInInaccessible = async (item: Route) => {
    try {
      console.log(id, item.id);

      await destroyRelation(id, item.id);
      await updatePermissions({
        idRota: item.id,
        idRole: id,
      });

      setInaccessibleRoutes((prev) => [...prev, item]);
      setAccessibleRoutes((prev) =>
        prev.filter((route) => route.id !== item.id)
      );

      toast.success("Permissão editada com sucesso");
    } catch (error) {
      toast.error("Erro ao editar permissão");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <form>
        <Box mt={10}>
          <Heading size="md" mb={6}>
            Editar permissões
          </Heading>
          <Flex justifyContent="space-between">
            <DroppableArea
              title="Com acesso"
              items={accessibleRoutes}
              onDrop={handleDropInAccessible}
            />
            <DroppableArea
              title="Sem acesso"
              items={inaccessibleRoutes}
              onDrop={handleDropInInaccessible}
            />
          </Flex>
        </Box>
      </form>
    </DndProvider>
  );
}
