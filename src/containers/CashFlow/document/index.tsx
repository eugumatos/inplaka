import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { format, parseISO } from "date-fns";
import { currency } from "@/utils/currency";
import { styles } from "./styles";

type DocumentProps = {
  orders: Array<any>;
  startDate: string;
  total: string;
};

export function PDFDocument({ orders, startDate, total }: DocumentProps) {
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
                    Relatório de Fluxo de Caixa
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.table}>
              <View style={[{ border: "2px solid #000" }, styles.columns]}>
                <View style={{ width: 200 }}>
                  <Text style={styles.columnText}>Descrição</Text>
                </View>
                <View style={{ width: 300, textAlign: "right" }}>
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
                      <View style={{ width: 200 }}>
                        <Text style={styles.columnText}>
                          {orderItem?.descricao}
                        </Text>
                      </View>

                      <View style={{ width: 300, textAlign: "right" }}>
                        <Text style={styles.columnText}>
                          {orderItem?.contaBancaria}
                        </Text>
                      </View>
                      <View style={{ width: 300, textAlign: "right" }}>
                        <Text style={styles.columnText}>
                          {orderItem?.formaPagamento}
                        </Text>
                      </View>
                      <View style={{ width: 300, textAlign: "right" }}>
                        <Text style={styles.columnText}>
                          {orderItem?.tipo}
                        </Text>
                      </View>
                      <View style={{ width: 300, textAlign: "right" }}>
                        <Text style={styles.columnText}>
                          {format(
                            parseISO(orderItem?.emissao),
                            "dd/MM/yyyy"
                          )}
                        </Text>
                      </View>
                      <View style={{ width: 300, textAlign: "right" }}>
                        <Text style={styles.columnText}>
                          {currency(orderItem?.valor)}
                        </Text>
                      </View>
                    </View>
                  </>
                );
              })}
            </View>

            <View style={styles.containerTotal}>
              <View style={styles.contentTotal}>
                <View style={styles.descriptionTotal}>
                  <View style={{ textAlign: "right" }}>
                    <Text style={[styles.totalText, { fontWeight: "bold" }]}>
                      Total da venda: {total}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
