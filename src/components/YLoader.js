import React from "react";
import { ActivityIndicator } from "react-native";
import { Colors } from "../styles";

/**
 * Composant affichant un spinner de chargement
 * @param {string} color - Couleur du spinner
 * @param {string} [size=large] - Taille du spinner
 */
function YLoader({ color = Colors.orange, size = "large" }) {
  return (
    <ActivityIndicator
      color={color}
      size={size}
      style={{ marginVertical: 5 }}
    />
  );
}

export default YLoader;
