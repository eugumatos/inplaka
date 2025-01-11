import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  theme,
} from "@chakra-ui/react";
import {
  RiAccountPinBoxLine,
  RiProductHuntLine,
  RiServiceLine,
  RiShoppingCartLine,
  RiUser3Line,
  RiUserSharedLine,
} from "react-icons/ri";

import { withSSRAuth } from "@/utils/hoc/withSSRAuth";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const options = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    type: "datetime",
    axisBorder: {
      color: theme.colors.gray[600],
    },
    axisTicks: {
      color: theme.colors.gray[600],
    },
    categories: [
      "2021-03-18T00:00.00Z",
      "2021-03-19T00:00.00Z",
      "2021-03-20T00:00.00Z",
      "2021-03-21T00:00.00Z",
      "2021-03-22T00:00.00Z",
      "2021-03-23T00:00.00Z",
      "2021-03-24T00:00.00Z",
    ],
  },
  fill: {
    opacity: 0.3,
    type: "gradient",
    gradient: {
      shade: "dark",
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
};

const series = [{ name: "series1", data: [31, 120, 10, 28, 61, 18, 109] }];

export default function Dashboard() {
  return (
    <Flex direction="column" h="100vh" w="85%">
      <Flex direction="column" w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <SimpleGrid
          flex={1}
          columns={3}
          spacing="20px"
          minChildWidth="320px"
          //alignItems="flex-start"
        >
          <Box flex={1} p={["6", "8"]} pb="4" bg="red.200" borderRadius={8}>
            <HStack align="center">
              <Icon as={RiAccountPinBoxLine} color="white" fontSize="35" />
              <Text color="white" fontSize="lg">
                Contas a pagar
              </Text>
              <Heading color="white" marginLeft="auto" size="lg">
                7
              </Heading>
            </HStack>
          </Box>
          <Box p={["6", "8"]} pb="4" bg="purple.300" borderRadius={8}>
            <HStack align="center">
              <Icon as={RiUser3Line} color="white" fontSize="28" />
              <Text color="white" fontSize="lg">
                Total de usuários ativos
              </Text>
              <Heading color="white" marginLeft="auto" size="lg">
                30
              </Heading>
            </HStack>
          </Box>
          <Box p={["6", "8"]} pb="4" bg="green.300" borderRadius={8}>
            <HStack align="center">
              <Icon as={RiShoppingCartLine} color="white" fontSize="28" />
              <Flex direction="column">
                <Text color="white" fontSize="lg">
                  Pedidos realizados
                </Text>

                <Text fontSize="15" color="#fff">
                  <strong>Essa semana</strong>
                </Text>
              </Flex>
              <Heading color="white" marginLeft="auto" size="lg">
                85
              </Heading>
            </HStack>
          </Box>

          <Box p={["6", "8"]} pb="4" bg="yellow.400" borderRadius={8}>
            <HStack align="center">
              <Icon as={RiServiceLine} color="white" fontSize="28" />
              <Text color="white" fontSize="lg">
                Total serviços
              </Text>
              <Heading color="white" marginLeft="auto" size="lg">
                14
              </Heading>
            </HStack>
          </Box>
          <Box flex={1} p={["6", "8"]} pb="4" bg="gray.300" borderRadius={8}>
            <HStack align="center">
              <Icon as={RiUserSharedLine} color="white" fontSize="28" />
              <Text color="white" fontSize="lg">
                Total fornecedores
              </Text>
              <Heading color="white" marginLeft="auto" size="lg">
                46
              </Heading>
            </HStack>
          </Box>
          <Box p={["6", "8"]} pb="4" bg="orange.300" borderRadius={8}>
            <HStack align="center">
              <Icon as={RiProductHuntLine} color="white" fontSize="28" />
              <Text color="white" fontSize="lg">
                Total produtos
              </Text>
              <Heading color="white" marginLeft="auto" size="lg">
                128
              </Heading>
            </HStack>
          </Box>
        </SimpleGrid>

        <SimpleGrid
          flex="1"
          gap="4"
          minChildWidth="320px"
          alignItems="flex-start"
          mt={8}
        >
          <Box p={["6", "8"]} pb="4" bg="white" borderRadius={8}>
            <Text fontSize="lg" mb="4">
              Taxa de etiquetas geradas essa semana
            </Text>
            <Chart options={options as any} series={series} type="area" />
          </Box>
          <Box p={["6", "8"]} pb="4" bg="white" borderRadius={8}>
            <Text fontSize="lg" mb="4">
              Taxa de pedidos realizados no último mês
            </Text>
            <Chart options={options as any} series={series} type="area" />
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
