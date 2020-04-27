import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { Colors } from "../styles";

/**
 * Composant affichant un champ de texte
 * et base sur TextInput de React Native
 * @param {string} [props.placeholder] - Texte affiche
 * lorsque la champ de texte est vide
 * @param {string} [props.value] - Contenu du champ de texte
 * @param {Function} [props.onChangeText] - Fonction execute lorsque le contenu change
 * @param {string} [props.type] - Type de clavier a afficher (email, numero)
 * @param {string} [props.secure] - Masquer la saisie pour augmenter la securite
 */
function YTextInput({
  placeholder,
  value,
  onChangeText = () => {},
  type = "default",
  secure,
}) {
  const KEYBOARD_TYPES = {
    email: "email-address",
    number: "decimal-pad",
  };

  return (
    <TextInput
      style={CSS.text_input}
      placeholder={placeholder}
      value={value}
      onChangeText={(text) => onChangeText(text)}
      secureTextEntry={secure ? true : false}
      keyboardType={KEYBOARD_TYPES[type]}
    />
  );
}

const CSS = StyleSheet.create({
  text_input: {
    height: 40,
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.light_gray,
    backgroundColor: Colors.white,
    fontSize: 16,
    textAlign: "center",
  },
});

export default YTextInput;
