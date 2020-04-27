import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../styles";

/**
 * Composant affichant un bouton au style uniforme sur toutes les plateformes
 * @param {string} [props.title=Bouton] - Texte affiche a l'interieur du bouton
 * @param {boolean} [props.secondary=false] - Style a appliquer
 * @param {Function} props.onPress - Fonction execute lors d'un appui court
 * @param {Function} props.onLongPress - Fonction execute lors d'un appui long
 */
function YButton({ title = "Button", secondary, onPress, onLongPress }) {
  const props = { title, secondary, onPress, onLongPress };

  return !secondary ? (
    <YButtonPrimary {...props} />
  ) : (
    <YButtonSecondary {...props} />
  );
}

// Bouton avec le style pricipal applique
function YButtonPrimary({ title = "Button", onPress, onLongPress }) {
  return (
    <View>
      <TouchableOpacity
        style={[CSS.button, CSS.button__primary]}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <Text style={[CSS.text, CSS.text__primary]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Bouton avec le style secondaire applique
function YButtonSecondary({ title = "Button", onPress, onLongPress }) {
  return (
    <View>
      <TouchableOpacity
        style={[CSS.button, CSS.button__secondary]}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <Text style={[CSS.text, CSS.text__secondary]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const CSS = StyleSheet.create({
  button: {
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    borderRadius: 100,
  },

  text: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  // Primary
  button__primary: {
    backgroundColor: Colors.orange,
  },

  text__primary: {
    color: Colors.white,
  },

  // Secondary
  button__secondary: {
    backgroundColor: Colors.white,
  },

  text__secondary: {
    color: Colors.orange,
  },
});

export default YButton;
