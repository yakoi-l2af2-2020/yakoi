import React from "react";
import {
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from "react-native";
import { Colors } from "../styles";

/**
 * Composant intermediare pour uniformiser l'affichage
 * pendant une saisie sur toutes iOS et Android.
 * @param {JSX} ElementsJSX - Contenu
 */
function YContainer({ children }) {
  return (
    <KeyboardAvoidingView
      style={CSS.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={CSS.inner}>
          <View style={CSS.inner_content}>{children}</View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const CSS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  inner: {
    flex: 1,
    justifyContent: "flex-end",
  },

  inner_content: {
    flex: 1,
  },
});

export default YContainer;
