import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../styles";

/**
 * Composant affichant un bouton contenant un icone
 * @param {string} props.name - Nom de l'icone
 * @param {boolean} props.secondary - Si present, applique le style secondaire
 * @param {string} props.color - Couleur de l'icone
 * @param {string} props.bgColor - Couleur du bouton
 * @param {number} [props.size=16] - Taille de l'icone
 * @param {string} [props.family=MCI] - Nom de la famille d'icones a utiliser (MaterialCommunityIcons par defaut)
 * @param {Function} props.onPress - Fonction a utiliser lors d'un appui
 */
function YIconButton({
  name = "cat",
  color = Colors.white,
  bgColor = Colors.orange,
  size = 16,
  secondary,
  family = "MCI",
  onPress,
}) {
  if (secondary) {
    color = Colors.orange;
    bgColor = Colors.white;
  }

  return (
    <TouchableOpacity
      style={[CSS.button, { backgroundColor: bgColor }]}
      onPress={onPress}
    >
      {family === "MI" ? (
        <MaterialIcons name={name} color={color} size={size} />
      ) : (
        <MaterialCommunityIcons name={name} color={color} size={size} />
      )}
    </TouchableOpacity>
  );
}

const CSS = StyleSheet.create({
  button: {
    height: 40,
    width: 40,
    backgroundColor: Colors.orange,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
});

export default YIconButton;
