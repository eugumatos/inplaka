import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  container: {
    padding: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  containerTitle: {
    borderTop: "1px solid #000",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 5,
    fontSize: 12,
    color: "#000",
  },
  main: {
    textAlign: "center",
    width: "50%",
  },
  containerBarcode: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },
  content: {
    lineHeight: "1.5px",
    fontSize: 11,
    fontWeight: "bold",
  },
  titles: {
    fontSize: 12,
    color: "#6C6C6C",
  },
});
