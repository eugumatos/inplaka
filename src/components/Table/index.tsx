import { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { RiDeleteBinLine, RiEditLine } from "react-icons/ri";
import { Column, useTable } from "react-table";

import { MAX_ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { Pagination } from "../Pagination";

interface DataTableProps<T extends object> {
  data: T[];
  columns: Column[];
  itemsPerPage?: number;

  onRowEdit?: (row: any) => void;
  onRowDelete?: (row: any) => void;
}

export function DataTable<T extends object>({
  data,
  columns,
  itemsPerPage,
  onRowEdit,
  onRowDelete,
}: DataTableProps<T>) {
  const shouldRenderActions = !!onRowEdit || !!onRowDelete;
  const maxItemsPerPage = itemsPerPage ?? MAX_ITEMS_PER_PAGE_DEFAULT;

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * maxItemsPerPage;
    const lastPageIndex = firstPageIndex + maxItemsPerPage;

    return rows.slice(firstPageIndex, lastPageIndex);
  }, [rows, currentPage, maxItemsPerPage]);

  return (
    <TableContainer
      w="100%"
      p={4}
      border="1px solid"
      borderRadius={6}
      borderColor="gray.100"
    >
      <Table {...getTableProps()}>
        {headerGroups.map((headerGroup) => (
          <>
            <Thead {...headerGroup.getHeaderGroupProps()}>
              <Tr>
                {headerGroup.headers.map((column) => (
                  <>
                    <Th {...column.getHeaderProps()} fontSize={15}>
                      {column.render("Header")}
                    </Th>
                  </>
                ))}
                {shouldRenderActions && (
                  <Th fontSize={15} textAlign="right">
                    Ações
                  </Th>
                )}
              </Tr>
            </Thead>
          </>
        ))}
        <Tbody {...getTableBodyProps()}>
          {currentTableData.map((row) => {
            prepareRow(row);

            return (
              <>
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <>
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    </>
                  ))}
                  {shouldRenderActions && (
                    <Td>
                      <Flex gap={4} justify="flex-end">
                        {!!onRowEdit && (
                          <Tooltip label="Editar">
                            <span>
                              <RiEditLine
                                size={20}
                                onClick={() => onRowEdit(row.original)}
                                style={{ cursor: "pointer" }}
                              />
                            </span>
                          </Tooltip>
                        )}

                        {!!onRowDelete && (
                          <Tooltip label="Excluir">
                            <span>
                              <RiDeleteBinLine
                                size={20}
                                color="#da6a6a"
                                onClick={() => onRowDelete(row.original)}
                                style={{ cursor: "pointer" }}
                              />
                            </span>
                          </Tooltip>
                        )}
                      </Flex>
                    </Td>
                  )}
                </Tr>
              </>
            );
          })}
        </Tbody>
      </Table>
      <Box px={4}>
        <Pagination
          totalCountOfRegisters={data.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Box>
    </TableContainer>
  );
}
