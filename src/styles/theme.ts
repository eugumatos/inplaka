import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    gray: {
      "900": "#181B23",
      "800": "#1F2029",
      "700": "#353646",
      "600": "#4B4D63",
      "500": "#616480",
      "400": "#797D9A",
      "300": "#9699B0",
      "200": "#EDEFF5",
      "100": "#D1D2DC",
      "50": "#EEEEF2",
    },
    pink: {
      "300": "#D056D2",
      "400": "#AF35B2",
    },
    red: {
      "200": "#da6a6a",
    },
    purple: {
      "300": "#7A70F0",
    },
    blue: {
      "100": "#0080F4",
      "200": "#0086DC",
      "300": "#0083B0",
    },
    green: {
      "200": "#007C7B",
    },
  },
  fonts: {
    heading: "Barlow",
    body: "Montserrat",
  },
  styles: {
    global: {
      body: {
        bg: "gray.200",
        color: "gray.400",
      },
    },
  },
});
