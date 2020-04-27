import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

import { Colors } from "../styles";

function YDiagram({ product_calories, nutriments, nutrient_levels }) {
  // Formatages nutriments
  const calories = {
    key: "1",
    nutriment: "Calories",
    value: product_calories,
    unit: "kcal",
    echelons: [160, 360, 560, 800],
    image: require("../assets/icons/FIRE.png"),
  };

  const salt = {
    key: "2",
    nutriment: "Sel",
    value: nutriments.salt,
    unit: nutriments.salt_unit || "g",
    level: nutrient_levels.salt,
    echelons: [0.46, 0.92, 1.62, 2.3],
    image: require("../assets/icons/SHAKER.png"),
  };

  const sugars = {
    key: "3",
    nutriment: "Sucres",
    value: nutriments.sugars,
    unit: nutriments.sugars_unit || "g",
    level: nutrient_levels.sugars,
    echelons: [9, 18, 31, 45],
    image: require("../assets/icons/CUBE.png"),
  };

  const fat = {
    key: "4",
    nutriment: "Lipides",
    value: nutriments.fat,
    unit: nutriments.fat_unit || "g",
    level: nutrient_levels.fat,
    echelons: [5, 10, 15, 20],
    image: require("../assets/icons/WATER_OUTLINE.png"),
  };

  const saturated_fat = {
    key: "5",
    nutriment: "Acides gras sat.",
    value: nutriments.saturated_fat,
    unit: nutriments.saturated_fat_unit || "g",
    level: nutrient_levels["saturated-fat"],
    echelons: [2, 4, 7, 10],
    image: require("../assets/icons/WATER.png"),
  };

  const proteins = {
    key: "6",
    nutriment: "Proteines",
    value: nutriments.proteins,
    unit: nutriments.proteins_unit || "g",
    echelons: [8, 16],
    image: require("../assets/icons/FISH.png"),
  };

  const fiber = {
    key: "7",
    nutriment: "Fibres",
    value: nutriments.fiber,
    unit: nutriments.fiber_unit || "g",
    echelons: [3.5, 7],
    image: require("../assets/icons/BARLEY.png"),
  };

  const fruitsAndVegetables = {
    key: "8",
    nutriment: "Fruits et Legumes",
    value: nutriments.fruits_vegetables,
    unit: "%",
    echelons: [25, 50, 75, 100],
    image: require("../assets/icons/FRUIT_CHERRIES.png"),
  };

  const diagram_data = [
    calories,
    salt,
    sugars,
    fat,
    saturated_fat,
    proteins,
    fiber,
    fruitsAndVegetables,
  ]
  // Filtrage des nutriments sans informations
  .filter((nutriment) => typeof nutriment.value !== undefined && nutriment.value > 0);
  
  // Si aucune donnees nutritionnelles
  if (diagram_data.length === 0)
    return <Text>Aucune donnees nutritionnelles</Text>;
  // Sinon afficher les diagrammes de chaque nutriment
  else
    return (
      <View>
        {diagram_data.map((nutriment) => {
          if (nutriment.value && nutriment.value > 0) {
            return (
              <YDiagramItem
                key={nutriment.key}
                nutriment={nutriment.nutriment}
                value={nutriment.value}
                unit={nutriment.unit}
                level={nutriment.level || null}
                echelons={nutriment.echelons}
                image={nutriment.image}
              />
            );
          }
        })}
      </View>
    );
}

function YDiagramItem({ nutriment, value, level, unit, echelons, image }) {
  // Traduction du niveau en francais
  const niveaux_fr = {
    low: "Faible",
    moderate: "Modere",
    high: "Eleve",
  };
  const level_fr = level ? " - " + niveaux_fr[level] : "";

  // Couleur de la valueur
  const colors = ["green", "light_green", "orange", "red"];
  const level_color = {
    high: Colors.red,
    moderate: Colors.orange,
    low: Colors.green,
  };

  const colorAccordingToLevel = {
    color: level ? level_color[level] : "black",
    fontWeight: "bold",
  };

  // Position du curseur
  function bornes_remplies() {
    let compteur = 0,
      i = 0;

    while (value >= echelons[i] && compteur < echelons.length - 1) {
      compteur++;
      i++;
    }

    return compteur;
  }

  const b_remplies = bornes_remplies();
  const nb_bornes = echelons.length;
  const b_inf = b_remplies === 0 ? 0 : echelons[b_remplies - 1];
  const b_sup = echelons[b_remplies];
  const pourcentage =
    b_remplies / nb_bornes + (value - b_inf) / (b_sup - b_inf) / nb_bornes;

  const dynamicCursor = StyleSheet.create({
    cursor: {
      flex: pourcentage, // max 1
    },
  });

  return (
    <View style={CSS.YDiagramItem}>
      {/* En tete */}
      <View style={CSS.informations}>
        <Image source={image} />
        <Text style={CSS.nutriment}>
          {nutriment} {level_fr}
        </Text>
        <Text style={colorAccordingToLevel}>
          {Math.round(value)} {unit || "g"}
        </Text>
      </View>

      {/* Diagramme horizontal */}
      <View>
        {/* Curseur */}
        <View style={CSS.cursor__row}>
          <View style={[CSS.cursor__container, dynamicCursor.cursor]}>
            <View style={CSS.cursor} />
          </View>
        </View>
      </View>

      {/* Diagramme */}
      <View style={CSS.diagram}>
        {echelons.map((echelon, index) => {
          const color = colors[index];
          const styles = {
            backgroundColor: Colors[color],
            // opacite differente selon les barres remplies
            opacity: index <= b_remplies ? 1 : 0.1,
          };

          return (
            <View
              style={CSS.echelon__container}
              key={"diagram_echelon_" + index}
            >
              <View style={[CSS.echelon_rect, styles]} />
              <View>
                <Text style={CSS.echelon_value}>{echelon} |</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const CSS = StyleSheet.create({
  YDiagramItem: {
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.light_gray,
    borderRadius: 15,
  },

  informations: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
  },

  nutriment: {
    fontSize: 16,
  },

  diagram: {
    flexDirection: "row",
  },

  cursor__row: {
    marginVertical: 8,
    flexDirection: "row",
  },

  cursor__container: {
    alignItems: "flex-end",
    zIndex: 100,
  },

  cursor: {
    width: 8,
    height: 8,
    backgroundColor: Colors.black,
    transform: [{ rotate: "45deg" }],
    top: 5,
  },

  echelon__container: {
    flex: 1,
  },

  echelon: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 100,
  },

  echelon_value: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: "right",
  },

  echelon_rect: {
    height: 10,
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: 100,
  },
});

export default YDiagram;
