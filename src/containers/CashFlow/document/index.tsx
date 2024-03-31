import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";

type DocumentProps = {
  orders: Array<any>;
  startDate: string;
};

export function PDFDocument({ orders, startDate }: DocumentProps) {
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
                  </View>
                </View>

                <View>
                  <View style={styles.descriptionItem}>
                    <Text style={styles.description}>
                      Relatório de Fluxo de Caixa
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.table}>
                <View style={[{ border: "2px solid #000" }, styles.columns]}>
                  <View style={{ width: 400 }}>
                    <Text style={styles.columnText}>Código</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.columnText}>Descrição</Text>
                  </View>
                  <View style={{ width: 100 }}>
                    <Text style={styles.columnText}>Conta</Text>
                  </View>
                  <View style={{ width: 300, textAlign: "right" }}>
                    <Text style={styles.columnText}>Forma de Pagamento</Text>
                  </View>
                  <View style={{ width: 300, textAlign: "right" }}>
                    <Text style={styles.columnText}>Tipo</Text>
                  </View>
                  <View style={{ width: 300, textAlign: "right" }}>
                    <Text style={styles.columnText}>Emissão</Text>
                  </View>
                  <View style={{ width: 300, textAlign: "right" }}>
                    <Text style={styles.columnText}>Valor</Text>
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
