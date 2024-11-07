import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { format, parseISO } from "date-fns";
import { currency } from "@/utils/currency";
import { styles } from "./styles";

type DocumentProps = {
  orders: Array<any>;
  startDate: string;
  endDate: string;
  total: number;
};

export function PDFDocument({ orders, startDate, endDate, total }: DocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.container}>
          <View style={styles.containerTitle}>
            <Text style={styles.title} fixed>
              CENTRAL PLACAS COMERCIO DE PLACAS AUTOMOTIVAS LTDA
            </Text>

            <View style={styles.descriptionContainer} fixed>
              <View>
                <View style={styles.descriptionItem}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.description}>De:</Text>
                    <Text style={[styles.description, { marginLeft: 5 }]}>
                      {startDate}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={[styles.description, { marginLeft: 15 }]}>
                      até:
                    </Text>
                    <Text style={[styles.description, { marginLeft: 5 }]}>
                      {endDate}
                    </Text>
                  </View>
                </View>
                {/* 
                  
                  <View style={styles.descriptionItem}>
                    <Text style={styles.description}>Status:</Text>
                    <Text style={[styles.description, { marginLeft: 30 }]}>
                      {order.status}
                    </Text>
                  </View>
                  */}
              </View>

              <View>
                <View style={styles.descriptionItem}>
                  <Text style={[styles.description, { fontSize: 14 }]}>
                    Relatório de Vendas
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.table}>
              <View style={[{ border: "2px solid #000" }, styles.columns]}>
                <View style={{ width: 150 }}>
                  <Text style={styles.columnText}>Número</Text>
                </View>
                <View style={{ width: 200 }}>
                  <Text style={styles.columnText}>Cliente</Text>
                </View>
                <View style={{ width: 200 }}>
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

              {orders?.map((orderItem: any, key: number) => {
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
                      <View style={{ width: 150 }}>
                        <Text style={styles.columnText}>
                          {orderItem?.numero}
                        </Text>
                      </View>
                      <View style={{ width: 200 }}>
                        <Text style={styles.columnText}>
                          {orderItem?.clienteNome}
                        </Text>
                      </View>

                      <View style={{ width: 200 }}>
                        <Text style={styles.columnText}>
                          {orderItem?.vendedorNome}
                        </Text>
                      </View>
                      <View style={{ width: 300, textAlign: "right" }}>
                        <Text style={styles.columnText}>
                          {orderItem?.formaPagamentoNome}
                        </Text>
                      </View>
                      <View style={{ width: 300, textAlign: "right" }}>
                        <Text style={styles.columnText}>
                          {format(
                            parseISO(orderItem?.dateCreated),
                            "dd/MM/yyyy"
                          )}
                        </Text>
                      </View>
                      <View style={{ width: 300, textAlign: "right" }}>
                        <Text style={styles.columnText}>
                          {currency(orderItem?.valorTotal)}
                        </Text>
                      </View>
                    </View>
                  </>
                );
              })}

              <View style={{ padding: 10, backgroundColor: 'white', textAlign: 'right' }}>
                <Text style={[styles.description, { fontSize: 14 }]}>Total de todas as vendas: {currency(total)}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
