import { StyleSheet } from "react-native";

export const Colors = {
  black: "#000",
  white: "#ffffff",
  gray: "#a3a8a3",
  light_gray: "#d8ddce",

  yellow: "rgb(254, 203, 2)",
  orange: "rgb(249, 99, 2)",
  light_orange: "#ee8100",
  green: "rgb(3, 129, 65)",
  light_green: "rgb(133, 187, 47)",
  red: "rgb(230, 62, 17)",

  // NUTRISCORE:
  nutriscore: {
    a: "rgb(3, 129, 65)", // vert
    b: "rgb(133, 187, 47)", // vert clair
    c: "rgb(254, 203, 2)", // jaune
    d: "rgb(249, 99, 2)", // orange
    e: "rgb(230, 62, 17)", // rouge
  },
  
  // NOVA
  nova: {
    1: "rgb(3, 129, 65)", //vert
    2: "rgb(133, 187, 47)", //vert clair
    3: "rgb(254, 203, 2)", // jaune
    4: "rgb(230, 62, 17)", // rouge
  },
};

export const Typography = StyleSheet.create({
  h1: {
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 30,
    fontWeight: "bold",
  },

  h2: {
    fontSize: 18,
    fontWeight: "bold",
  },

  h3: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.orange,
    marginBottom: 8,
  },

  text: {
    fontSize: 14,
  },

  small: {
    fontSize: 12,
  },

  muted: {
    color: Colors.gray,
  },

  center: {
    textAlign: "center",
  },
});
