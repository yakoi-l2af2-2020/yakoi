import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "../styles";

/**
 * Composant affichant une image et un message.
 * Utilise principalement lorsqu'une liste est vide.
 */
function YEmptyList() {
  const IMAGE_SIZE = 200;

  return (
    <View style={CSS.container}>
      <Image
        style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        source={require("../assets/background/BREAKFAST.png")}
      />
      <Text>Aucun produit</Text>
    </View>
  );
}

const CSS = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
});

export default YEmptyList;
