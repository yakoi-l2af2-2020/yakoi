import React, { useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Colors } from "../styles";

/**
 * Composant affichant une barre de progression.
 * @param {number} props.value - Valeur
 * @param {number} props.max - Maximum
 * @param {small} [props.small=false] - Taille de la barre de progression
 */
function YProgressBar({ value = 0, max = 100, small }) {
  const percent = value / max;
  const flexValue = new Animated.Value(0);

  // Declancher l'animation au debut
  useEffect(() => {
    Animated.timing(flexValue, {
      toValue: percent,
      duration: 1000 * percent,
    }).start();
  });

  // Couleur en fonction du pourcentage
  let color;

  if (percent < 1 / 4) color = Colors.light_gray;
  else if (percent < 2 / 4) color = Colors.yellow;
  else if (percent < 3 / 4) color = Colors.light_green;
  else if (percent < 4 / 4) color = Colors.green;
  else if (percent < 5 / 4) color = Colors.orange;
  else color = Colors.red; // > 1.25

  // Styles en fonction des props
  const dynamicStyles = {
    backgroundColor: color,
    margin: small ? 4 : 8,
    height: small ? 15 : 40,
    minWidth: small ? 15 : 40,
  };

  return (
    <View style={CSS.progress}>
      <Animated.View
        style={[CSS.bar, dynamicStyles, { flex: flexValue }]}
      >
        <View />
      </Animated.View>
    </View>
  );
}

const CSS = StyleSheet.create({
  progress: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light_gray,
  },

  bar: {
    borderRadius: 100,
  },
});

export default YProgressBar;
