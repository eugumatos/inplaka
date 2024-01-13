import { useRef, useState, useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverFooter,
  IconButton,
  PopoverContent,
  FocusLock,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
  Button,
  ButtonGroup,
  Flex,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
  VStack,
  Text,
  Center,
  Tooltip,
  Badge,
  Box,
  Container,
  Heading,
} from "@chakra-ui/react";
import { Input } from "@/components/Input";
import { FullModal } from "@/components/Modals/FullModal";
import { useOrderForm } from "@/containers/Order/hooks/useOrderForm";
import { RiDeleteBin7Line, RiFullscreenFill } from "react-icons/ri";
import { BsSignpostFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { upper } from "@/utils/upper";
import { DataTable } from "@/components/Table";
import { Column } from "react-table";
import { IProduct } from "@/domains/product";
import { IService } from "@/domains/service";

interface PopoverPlaqueFormProps {
  product: IProduct;
  updateProductPlaque: (id: string, name: string) => void;
  removeProductPlaque: (id: string, name: string) => void;
  isDisabled?: boolean;
}

export const PopoverPlaqueForm = ({
  product,
  updateProductPlaque,
  removeProductPlaque,
  isDisabled,
}: PopoverPlaqueFormProps) => {
  const popoverDisclosure = useDisclosure();
  const fullModalDisclosure = useDisclosure();

  const firstFieldRef = useRef(null);

  const [plaqueList, setPlaqueList] = useState<Array<string> | []>([]);

  const plaqueListData = plaqueList.map((item, key) => {
    return {
      id: key,
      descricao: upper(item),
    };
  });

  const [plaque, setPlaque] = useState("");

  const shouldDisabledAddButton =
    product.quantidade > 0 && product.placas.length < product.quantidade;

  const columns = useMemo(
    (): Column[] => [
      {
        Header: "Placa",
        accessor: "descricao",
      },
    ],
    []
  );

  return (
    <>
      <Popover
        isOpen={popoverDisclosure.isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={popoverDisclosure.onOpen}
        onClose={popoverDisclosure.onClose}
        placement="right"
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <Box position="relative">
            {product.placas.length > 0 && (
              <Badge
                bg="pink.300"
                color="white"
                position="absolute"
                rounded="xl"
                left={7}
                bottom={6}
                zIndex={1}
              >
                {product.placas.length}
              </Badge>
            )}
            <Tooltip label="Placas">
              <IconButton
                aria-label=""
                size="md"
                bg="teal.400"
                isDisabled={isDisabled}
                icon={<BsSignpostFill color="#fff" />}
              />
            </Tooltip>
          </Box>
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />

            <Tabs mt={5} isFitted variant="enclosed">
              <TabList>
                <Tab>Formulário</Tab>
                <Tab>Lista</Tab>
              </TabList>
              <TabPanels mt={5}>
                <TabPanel p={0}>
                  <form>
                    <Flex direction="column">
                      <Input
                        name="placa"
                        placeholder="Ex: CFC-8949"
                        label="Placa"
                        value={plaque}
                        textTransform="uppercase"
                        onChange={(e) => {
                          setPlaque(e.target.value);
                        }}
                      />
                    </Flex>
                  </form>
                  <PopoverFooter
                    py={3}
                    px={0}
                    display="flex"
                    justifyContent="flex-end"
                  >
                    <ButtonGroup size="sm">
                      <Button
                        variant="outline"
                        onClick={popoverDisclosure.onClose}
                      >
                        Cancelar
                      </Button>
                      <Button
                        bg="pink.300"
                        color="gray.50"
                        _hover={{
                          bg: "pink.400",
                        }}
                        isDisabled={!shouldDisabledAddButton}
                        onClick={() => {
                          if (plaque.length > 0) {
                            updateProductPlaque(product.id, plaque);
                            setPlaque("");

                            toast.success(
                              `Placa adicionada! Você consegue visualiza-lá na aba "Lista" ao lado.`
                            );
                          }
                        }}
                      >
                        {" "}
                        Adicionar
                      </Button>
                    </ButtonGroup>
                  </PopoverFooter>
                </TabPanel>
                <TabPanel>
                  {product.placas.length === 0 ? (
                    <Center>
                      <Text>Nenhuma placa adicionada!</Text>
                    </Center>
                  ) : (
                    <VStack maxH={400} overflow="auto">
                      {product.placas.map((p) => (
                        <Flex
                          key={p}
                          py={2}
                          w="100%"
                          align="center"
                          justify="space-between"
                        >
                          <Text textTransform="uppercase" fontWeight="bold">
                            {p}
                          </Text>
                          <IconButton
                            bg="red.300"
                            aria-label="Remove plaque"
                            size="sm"
                            icon={
                              <RiDeleteBin7Line
                                size={18}
                                cursor="pointer"
                                color="#fff"
                              />
                            }
                            onClick={() => {
                              removeProductPlaque(product.id, p);
                            }}
                            _hover={{
                              bg: "red.400",
                            }}
                          />
                        </Flex>
                      ))}
                    </VStack>
                  )}

                  <Flex justify="flex-end" mt={8}>
                    <Tooltip label="Tela inteira">
                      <IconButton
                        color="#fff"
                        bg="gray.300"
                        aria-label="Call Segun"
                        size="sm"
                        onClick={fullModalDisclosure.onOpen}
                        icon={<RiFullscreenFill />}
                      />
                    </Tooltip>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </FocusLock>
        </PopoverContent>
      </Popover>
      <FullModal
        isOpen={fullModalDisclosure.isOpen}
        onClose={fullModalDisclosure.onClose}
      >
        <Container maxW={1480} p={10}>
          <Heading size="lg">Lista de placas</Heading>

          <Flex maxW="38%" align="end" gap={5} my={6}>
            <Input
              name="placa"
              placeholder="Ex: CFC-8949"
              label="Digite o número da placa"
              value={plaque}
              textTransform="uppercase"
              onChange={(e) => {
                setPlaque(e.target.value);
              }}
            />
            <Button
              fontSize={15}
              bg="pink.300"
              color="gray.50"
              _hover={{
                bg: "pink.400",
              }}
              isDisabled={!shouldDisabledAddButton}
              onClick={() => {
                if (plaque.length > 0) {
                  updateProductPlaque(product.id, plaque);
                  setPlaque("");

                  toast.success(
                    `Placa adicionada! Você consegue visualiza-lá na aba "Lista" ao lado.`
                  );
                }
              }}
            >
              ADICIONAR
            </Button>
          </Flex>

          <DataTable
            columns={columns}
            data={product.placas as any}
            onRowDelete={(row) => {
              removeProductPlaque(product.id, row);

              toast.info(`Placa ${upper(row)} removida!`);
            }}
          />
        </Container>
      </FullModal>
    </>
  );
};
