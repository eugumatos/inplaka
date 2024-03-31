import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";

type DocumentProps = {
  orders: Array<any>;
  startDate: string;
  endDate: string;
};

export function PDFDocument({ orders, startDate, endDate }: DocumentProps) {
  return (
    <Document>
      {orders.map((order, key) => (
        <Page key={key} size="A4" style={styles.page} orientation="landscape">
          <View style={styles.container}>
            <View style={styles.containerTitle}>
              <Text style={styles.title}>
                CENTRAL PLACAS COMERCIO DE PLACAS AUTOMOTIVAS LTDA
              </Text>

              <View style={styles.descriptionContainer}>
                <View>
                  <View style={styles.descriptionItem}>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.description}>De:</Text>
                      <Text style={[styles.description, { marginLeft: 15 }]}>
                        {startDate}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={[styles.description, { marginLeft: 15 }]}>
                        até:
                      </Text>
                      <Text style={[styles.description, { marginLeft: 24 }]}>
                        {endDate}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.descriptionItem}>
                    <Text style={styles.description}>Status:</Text>
                    <Text style={[styles.description, { marginLeft: 30 }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View>
                  <View style={styles.descriptionItem}>
                    <Text style={styles.description}>Relatório de Vendas</Text>
                  </View>
                </View>
              </View>

              <View style={styles.table}>
                <View style={[{ border: "2px solid #000" }, styles.columns]}>
                  <View style={{ width: 400 }}>
                    <Text style={styles.columnText}>Número</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.columnText}>Cliente</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.columnText}>Vendedor</Text>
                  </View>
                  <View style={{ width: 300, textAlign: "right" }}>
                    <Text style={styles.columnText}>Condição Pgto</Text>
                  </View>
                  <View style={{ width: 300, textAlign: "right" }}>
                    <Text style={styles.columnText}>Data de Emissão</Text>
                  </View>
                  <View style={{ width: 300, textAlign: "right" }}>
                    <Text style={styles.columnText}>Valor Total</Text>
                  </View>
                </View>

                {order.products?.map((orderItem: any, key: number) => {
                  const isOdd = key % 2;

                  return (
                    <>
                      <View
                        key={key}
                        style={[
                          { backgroundColor: isOdd === 0 ? "#ddd8d8" : "#fff" },
                          { marginHorizontal: 2 },
                          styles.columns,
                        ]}
                      >
                        <View style={{ width: 400 }}>
                          <Text style={styles.columnText}>
                            {orderItem?.numero}
                          </Text>
                        </View>
                        <View style={{ width: 100 }}>
                          <Text style={styles.columnText}>
                            {orderItem?.amount}
                          </Text>
                        </View>

                        <View style={{ width: 100 }}>
                          <Text style={styles.columnText}>
                            {orderItem?.plaque}
                          </Text>
                        </View>
                        <View style={{ width: 300, textAlign: "right" }}>
                          <Text style={styles.columnText}></Text>
                        </View>
                        <View style={{ width: 300, textAlign: "right" }}>
                          <Text style={styles.columnText}>
                            {orderItem?.value}
                          </Text>
                        </View>
                      </View>
                    </>
                  );
                })}
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}
