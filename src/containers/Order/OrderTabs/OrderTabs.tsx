import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { OrderTable } from "./OrderTable";
import { OrderOthers } from "./OrderOthers";

type OrderTabsProps = {
  clientId: string;
};

export function OrderTabs({ clientId }: OrderTabsProps) {
  return (
    <Tabs isManual variant="enclosed">
      <TabList>
        <Tab>Produtos</Tab>
        <Tab>Outros</Tab>
        <Tab hidden={!clientId}>Placas</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <OrderTable />
        </TabPanel>
        <TabPanel>
          <OrderOthers />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
