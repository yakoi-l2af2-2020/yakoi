import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Colors } from "../styles";

/**
 * Composant qui permet de selectionner une option
 * @param {Array<string>} props.options - Tableau contenant les differentes options
 * @param {Function} props.setOption - Fonction qui modifie la valeur du receveur
 */
export default function YOptionGroup({ options, option, setOption }) {

  // Index initial a l'index de l'option
  const [activeIndex, setActiveIndex] = useState(options.indexOf(option.toString()) || 0);

  return (
    <View style={CSS.option_group}>
      {options &&
        options.map((option, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                // Mise a jour de l'index
                setActiveIndex(index);

                // Mise a jour du receveur
                setOption(option);
              }}
              style={[CSS.option, activeIndex === index && CSS.active_option]}
              key={index}
            >
              <Text style={activeIndex === index && CSS.active_option_text}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
}

const CSS = StyleSheet.create({
  option_group: {
    height: 40,
    flexDirection: "row",
    padding: 2,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.light_gray,
  },

  option: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },

  active_option: {
    backgroundColor: Colors.orange,
  },

  active_option_text: {
    color: Colors.white,
    fontWeight: "bold",
  },
});
