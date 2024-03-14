import React, { useState, useMemo, useRef } from "react";
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
  Text,
  IconButton,
} from "@chakra-ui/react";
import {
  RiDeleteBinLine,
  RiEditLine,
  RiSearchLine,
  RiQrCodeFill,
} from "react-icons/ri";

import { Column, useGlobalFilter, useTable } from "react-table";

import { RangeDatePicker } from "@/components/Forms/RangeDatePicker";
import { MAX_ITEMS_PER_PAGE_DEFAULT } from "@/constants";
import { Pagination } from "../Pagination";
import { UploadFile } from "./UploadFile";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFDocument } from "@/containers/Order/document/barcode";

type RangeDate = {
  startDate: Date | null;
  endDate: Date | null;
};

interface DataTableProps<T extends object> {
  data: T[];
  columns: Column[];

  isLoading?: boolean;
  itemsPerPage?: number;
  showGeneratedData?: boolean;

  customnAction?: (row: any) => JSX.Element;
  onRowEdit?: (row: any) => void;
  onRowDelete?: (row: any) => void;
  onFilterByDate?: ({ startDate, endDate }: RangeDate) => void;
  onImport?: (parsedData: any) => void;
  generatedData?: Array<any>;
  disableImport?: boolean;
}

export function DataTable<T extends object>({
  data,
  columns,
  isLoading,
  itemsPerPage,
  customnAction,
  onRowEdit,
  onRowDelete,
  onFilterByDate,
  onImport,
  disableImport,
  generatedData,
  showGeneratedData,
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
      <Flex justifyContent="space-between">
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

        <Flex gap={5}>
          {!!onFilterByDate && (
            <RangeDatePicker getRangeDate={onFilterByDate} />
          )}

          {showGeneratedData && (
            <Tooltip label="Gerar etiquetas">
              <PDFDownloadLink
                fileName="etiquetas"
                document={<PDFDocument placas={generatedData ?? []} />}
              >
                <IconButton
                  aria-label="Search database"
                  bg="orange.300"
                  icon={<RiQrCodeFill color="#fff" />}
                  // onClick={() => fileUploadButtonRef.current?.click()}
                  _hover={{
                    bg: "orange.400",
                  }}
                />
              </PDFDownloadLink>
            </Tooltip>
          )}

          {!!onImport && (
            <UploadFile onParsedData={onImport} isDisabled={disableImport} />
          )}
        </Flex>
      </Flex>

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

      {currentTableData.length === 0 && (
        <Center mt={10}>
          <Text size="xl">Não há registros a serem exibidos</Text>
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
