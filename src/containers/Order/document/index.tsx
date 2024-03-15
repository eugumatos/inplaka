import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./styles";

type DocumentProps = {
  order: any;
  shouldRenderValues?: boolean;
};

export function PDFDocument({
  order,
  shouldRenderValues = true,
}: DocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.container}>
          <View style={styles.containerTitle}>
            <Text style={styles.title}>
              EMPRESA: CENTRAL PLACAS COMERCIO DE PLACAS AUTOMOTIVAS LTDA
            </Text>

            <View style={styles.descriptionContainer}>
              <View>
                <View style={styles.descriptionItem}>
                  <Text style={styles.description}>Cliente:</Text>
                  <Text style={[styles.description, { marginLeft: 44 }]}>
                    {order?.clientName}
                  </Text>
                </View>
                <View style={styles.descriptionItem}>
                  <Text style={styles.description}>Endereço:</Text>
                  <Text style={[styles.description, { marginLeft: 30 }]}>
                    {order?.clientAddress}
                  </Text>
                </View>
                <View style={styles.descriptionItem}>
                  <Text style={styles.description}>Bairro:</Text>
                  <Text style={[styles.description, { marginLeft: 50 }]}>
                    {order?.clientNeighborhood}
                  </Text>
                </View>
                <View style={styles.descriptionItem}>
                  <Text style={styles.description}>Cidade:</Text>
                  <Text style={[styles.description, { marginLeft: 44 }]}>
                    {order?.clientCity}
                  </Text>
                </View>
              </View>

              <View>
                <View style={styles.descriptionItem}>
                  <Text style={styles.description}>Número:</Text>
                  <Text style={[styles.description, { marginLeft: 5 }]}>
                    {order?.orderNumber}
                  </Text>
                </View>
                <View style={styles.descriptionItem}>
                  <Text style={styles.description}>Data:</Text>
                  <Text style={[styles.description, { marginLeft: 5 }]}>
                    {order?.orderDate}
                  </Text>
                </View>
                <View style={styles.descriptionItem}>
                  <Text style={styles.description}>Email:</Text>
                  <Text style={[styles.description, { marginLeft: 5 }]}>
                    {order?.clientEmail}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.table}>
              <View style={[{ border: "2px solid #000" }, styles.columns]}>
                <View style={{ width: 400 }}>
                  <Text style={styles.columnText}>Produto</Text>
                </View>
                <View style={{ width: 100 }}>
                  <Text style={styles.columnText}>Qtd</Text>
                </View>
                <View style={{ width: 100 }}>
                  <Text style={styles.columnText}>Placa</Text>
                </View>
                <View style={{ width: 300, textAlign: "right" }}>
                  <Text style={styles.columnText}>Cidade</Text>
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
                        <Text style={styles.columnText}>{orderItem?.name}</Text>
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
                          {shouldRenderValues && orderItem?.value}
                        </Text>
                      </View>
                    </View>
                  </>
                );
              })}
            </View>

            {shouldRenderValues && (
              <View style={styles.containerTotal}>
                <View style={styles.contentTotal}>
                  <View style={styles.descriptionTotal}>
                    <View style={{ textAlign: "right" }}>
                      {/*
                      <Text style={[styles.totalText, { fontWeight: "bold" }]}>
                        Total dos produtos:
                      </Text>
                      */}
                    </View>
                    <Text style={styles.totalText}></Text>
                  </View>
                  <View style={styles.descriptionTotal}>
                    <View style={{ textAlign: "right" }}>
                      <Text style={[styles.totalText, { fontWeight: "bold" }]}>
                        Total da venda: {order?.total}
                      </Text>
                    </View>
                    <Text style={styles.totalText}></Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
