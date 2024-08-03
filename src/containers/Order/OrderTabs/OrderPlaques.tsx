import { useEffect, useMemo, useState } from "react";
import { Column } from "react-table";

import { getPlaques } from "@/services/order";

import { DataTable } from "@/components/Table";

import { filterText } from "@/utils/filterText";
import { upper } from "@/utils/upper";
import { toast } from "react-toastify";

export type IPlaque = {
  descricao: string;
  placaQuitada: boolean;
};

type OrderPlaqueProps = {
  clientId: string;
};

export function OrderPlaques({ clientId }: OrderPlaqueProps) {
  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Nome",
        accessor: "descricao",
        Cell: ({ value }) => filterText(upper(value), 55),
      },
    ],
    []
  );

  const [plaques, setPlaques] = useState<IPlaque[]>([]);

  async function loadPlaqueList() {
    try {
      const plaques = await getPlaques(clientId);

      const list: IPlaque[] = plaques.map((p) => {
        return {
          descricao: p.placa,
          placaQuitada: p.placaQuitada,
        };
      });

      setPlaques(list);
    } catch (error) {
      toast.error("Erro ao carregar lista de placas.");

      throw new Error("Error to load plaques.");
    }
  }

  useEffect(() => {
    if (!clientId) loadPlaqueList();
  });

  return <DataTable columns={columns} data={plaques} />;
}
