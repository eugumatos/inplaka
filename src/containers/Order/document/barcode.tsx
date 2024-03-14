import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import { styles } from "./barcodeStyles";

type DocumentProps = {
  placas:
    | Array<{
        descricao: string;
        chassi: string;
        marca_modelo: string;
        endereco: string;
      }>
    | [];
};

export function PDFDocument({ placas }: DocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.containerTitle}>
          <Text style={styles.title}>
            ETIQUETAS: CENTRAL PLACAS COMERCIO DE PLACAS AUTOMOTIVAS LTDA
          </Text>
        </View>
        <View style={styles.container}>
          {placas?.map((item, key) => (
            <View key={key} style={[styles.main, { marginBottom: 15 }]}>
              <Text style={styles.titles}>CÓDIGO DE BARRAS</Text>
              <View style={styles.containerBarcode}>
                <View style={styles.content}>
                  <Text>{item.descricao}</Text>
                  <Text>{item.chassi}</Text>
                  <Text>{item.marca_modelo}</Text>
                  <Text>{item.endereco}</Text>
                </View>
                <Text style={styles.titles}>QR CODE</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
