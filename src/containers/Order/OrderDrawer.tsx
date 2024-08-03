import { useRef, useState } from "react";

import {
  Box,
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Divider,
} from "@chakra-ui/react";
import { RiArrowDownSLine } from "react-icons/ri";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

import {
  OrderProductProvider,
  useOrderProducts,
} from "./contexts/OrderProductContext";

import { OrderForm } from "./OrderForm";
import { OrderTabs } from "./OrderTabs/OrderTabs";
import { OrderSummary } from "./OrderSummary";

import { upper } from "@/utils/upper";

interface OrderDraweProps {
  clientId: string;

  isOpen: boolean;
  onClose: () => void;
}

export function OrderDrawer({ isOpen, onClose, clientId }: OrderDraweProps) {
  const { getValues, setValue } = useFormContext();

  const { products } = useOrderProducts();

  const containerTotalRef = useRef<null | HTMLDivElement>(null);

  function onScrollToTotal() {
    containerTotalRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSubmit() {
    const formValues = getValues();

    if (formValues.valorTotal === 0) {
      toast.warning(
        "É necessário adicionar pelo menos um produto antes de realizar um pedido."
      );

      setValue("status", "");

      return;
    }

    const plaquesNotFilled = products.filter(
      (p) => p.quantidade !== p.placas?.length
    );

    if (plaquesNotFilled.length > 0) {
      toast.warning(
        `Não foi preenchido o nome de todas as placas referente aos seguintes produtos ("${plaquesNotFilled.forEach(
          (p) => upper(p.descricao) + " "
        )}"). Por favor verifique e tente novamente.`
      );

      setValue("status", "");

      return;
    }

    console.log(formValues);
  }

  return (
    <Drawer
      size="xl"
      onClose={onClose}
      isOpen={isOpen}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerBody>
          <Flex direction="column" gap={10}>
            <Flex h="97vh" direction="column" gap={5}>
              <Box>
                <OrderForm />

                <Divider my={4} />

                <OrderTabs clientId={clientId} />
              </Box>

              <Button
                mt="auto"
                ml="auto"
                type="button"
                w="40%"
                bg="transaprent"
                border="1px"
                onClick={onScrollToTotal}
                rightIcon={<RiArrowDownSLine size={20} />}
              >
                Ir para fechamento do pedido
              </Button>
            </Flex>

            <Flex flex={1} ref={containerTotalRef}>
              <OrderSummary onSubmit={handleSubmit} />
            </Flex>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
