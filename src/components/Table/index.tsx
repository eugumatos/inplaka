import React, { useState, useMemo } from "react";
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
  Spinner,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { RiDeleteBinLine, RiEditLine, RiSearchLine } from "react-icons/ri";
import { Column, useGlobalFilter, useTable } from "react-table";

import { MAX_ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { Pagination } from "../Pagination";

interface DataTableProps<T extends object> {
  data: T[];
  columns: Column[];
  isLoading?: boolean;
  itemsPerPage?: number;

  customnAction?: (row: any) => JSX.Element;
  onRowEdit?: (row: any) => void;
  onRowDelete?: (row: any) => void;
}

export function DataTable<T extends object>({
  data,
  columns,
  isLoading,
  itemsPerPage,
  customnAction,
  onRowEdit,
  onRowDelete,
}: DataTableProps<T>) {
  const shouldRenderActions = !!onRowEdit || !!onRowDelete || !!customnAction;
  const maxItemsPerPage = itemsPerPage ?? MAX_ITEMS_PER_PAGE_DEFAULT;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter
  );

  const [search, setSearch] = useState(state.globalFilter);

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
      <InputGroup maxW="26%" mb={4}>
        <InputLeftElement>
          <RiSearchLine />
        </InputLeftElement>

        <Input
          placeholder="Buscar"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setGlobalFilter(e.target.value);
          }}
        />
      </InputGroup>
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

        <Tbody hidden={isLoading} {...getTableBodyProps()}>
          {currentTableData.map((row) => {
            prepareRow(row);

            return (
              <React.Fragment key={row.id}>
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

                        {!!customnAction && customnAction(row.original)}
                      </Flex>
                    </Td>
                  )}
                </Tr>
              </React.Fragment>
            );
          })}
        </Tbody>
      </Table>

      {isLoading && (
        <Center my={10}>
          <Spinner size="lg" />
        </Center>
      )}

      <Box hidden={isLoading} px={4}>
        <Pagination
          registerPerPage={itemsPerPage}
          totalCountOfRegisters={data.length}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Box>
    </TableContainer>
  );
}
