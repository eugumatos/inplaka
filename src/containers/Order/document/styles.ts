import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  container: {
    padding: 20,
  },
  containerTitle: {
    borderTop: "1px solid #000",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 8,
    fontSize: 12,
    color: "#000",
  },
  descriptionContainer: {
    marginTop: 14,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  description: {
    fontSize: 12,
    color: "#000",
    lineHeight: 2,
  },
  descriptionItem: {
    display: "flex",
    flexDirection: "row",
  },
  subTitle: {
    fontSize: 11,
    marginTop: "auto",
  },
  table: {
    width: "100%",
    marginTop: 10,
  },
  columns: {
    padding: 2,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  columnText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cell: {
    paddingLeft: 1,
  },
  containerTotal: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  contentTotal: {
    width: "100%",
    padding: 20,
    border: "1px solid #000",
  },
  descriptionTotal: {
    flexDirection: "row",
    justifyContent: "flex-end",

    textAlign: "right",
  },
  totalText: {
    fontSize: 12,
    marginTop: 4,
  },
});
