import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { YButton, YProduct, YDiagram, YIconButton } from "../../components";
import { Colors, Typography } from "../../styles/";

import {
  MaterialCommunityIcons as Icon,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";
import { ROUTES } from "../../utils";
import { connect } from "react-redux";

function ProductScreen(props) {
  // Recuperer les donnees d'un produit passes par la navigation
  let product = props.navigation.getParam("product");
  const [favorite, setFavorite] = useState(product.favorite);

  // Recuperation des donnees de chaque nutriment
  const { nutriments, nutrient_levels } = product;

  /* -------------------------------------------------------------------------- */
  /*                                 Allergenes                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Renvoi les allergenes presents dans
   * l'nsemble des allergenes recenses sur la base de donnee OpenFoodFacts
   * et presents dans au moins 1000 aliments :
   * ["en:milk", "en:gluten", "en:soybeans",
   * "en:egg"s, "en:nuts", "en:mustard",
   * "en:fish", "en:celery", "en:sulphur-dioxide-and-sulphites",
   * "en:peanuts", "en:sesame-seeds", "en:crustaceans",
   * "en:molluscs", fr:avoine"]
   * @param {Array<string>} allergens_list - Liste des allergenes presents dans le produit
   * @returns {string} Allergenes trouves et separes par des virgules, sinon "Aucun allergenes trouves"
   */
  function foundAllergens(allergens_list) {
    let allergens = [];
    for (let i = 0; i < allergens_list.length; i++) {
      if (allergens_list[i] === "en:fish") allergens.push("poisson");
      if (allergens_list[i] === "en:milk") allergens.push("lait");
      if (allergens_list[i] === "en:gluten") allergens.push("gluten");
      if (allergens_list[i] === "en:soybeans") allergens.push("soja");
      if (allergens_list[i] === "en:eggs") allergens.push("oeufs");
      if (allergens_list[i] === "en:nuts") allergens.push("noix");
      if (allergens_list[i] === "en:mustard") allergens.push("moutarde");
      if (allergens_list[i] === "en:celery") allergens.push("celeri");
      if (allergens_list[i] === "en:sulphur-dioxide-and-sulphites")
        allergens.push("sulfites");
      if (allergens_list[i] === "en:peanuts") allergens.push("cacahuetes");
      if (allergens_list[i] === "en:sesame-seeds")
        allergens.push("graines de sesame");
      if (allergens_list[i] === "en:crustaceans") allergens.push("crustaces");
      if (allergens_list[i] === "en:molluscs") allergens.push("mollusques");
      if (allergens_list[i] === "fr:avoine") allergens.push("avoine");
    }
    // Si aucun allergenes n'est present
    if (allergens.length === 0) allergens.push("Aucun allergenes");
    return allergens.join(", ");
  }

  /* --------------------------------- FAVORIS -------------------------------- */
  function addToFavorites() {
    // Requete pour ajouter ou enlever un produit des favoris
    fetch(ROUTES.FAVORITES(props.email), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: product.code }),
    })
      .then((res) => res.json())
      .then((res) => {
        // Si correctement effectue
        if (res.ok) {
          setFavorite(!favorite);

          Alert.alert(
            "✔ C'est fait !",
            product.name +
              " a bien ete " +
              (favorite ? "enleve de" : "ajoute a") +
              " vos favoris",
          );
        }
      })
      .catch((err) => {
        console.log(err);

        Alert.alert("Erreur", "Le produit n'a pu etre ajoute aux favoris");
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */
  
  return (
    <ScrollView style={CSS.container}>
      <View style={CSS.inner}>
        <YProduct {...product} />

        {/* Actions */}
        <View>
          <View style={CSS.section}>
            {product.calories > 0 && (
              <View style={CSS.actions}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <YButton
                    title="+ Consommer"
                    onPress={function () {
                      props.navigation.push("ConsumptionForm", {
                        product,
                      });
                    }}
                  />
                </View>
                <YIconButton
                  name={favorite ? "star-off" : "star"}
                  size={28}
                  bgColor={Colors.white}
                  color={Colors.yellow}
                  onPress={addToFavorites}
                />
              </View>
            )}
          </View>

          {/* Labels et ingredients */}
          {(product.ingredients || product.labels) && (
            <LabelsAndTags
              ingredients={product.ingredients_tags}
              labels={product.labels}
            />
          )}

          {/* Diagramme */}
          {nutriments && (
            <View style={CSS.section}>
              <Text style={Typography.h3}>
                Valeurs nutritionnelles pour 100 g (ou ml)
              </Text>
              <YDiagram
                product_calories={product.calories}
                nutriments={nutriments}
                nutrient_levels={nutrient_levels}
              />
            </View>
          )}

          {/*Score NOVA */}
          {product.nova && <Nova group={product.nova} />}

          {/* Ingredients */}
          {product.ingredients.length > 0 && (
            <View style={CSS.section}>
              <Text style={Typography.h3}>Ingredients :</Text>
              <Text>{product.ingredients}</Text>
            </View>
          )}

          {/*Liste allergenes */}
          <View style={CSS.section}>
            <Text style={Typography.h3}>Allergenes :</Text>
            <Text>{foundAllergens(product.allergens)}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

/* ---------------------------------- Nova ---------------------------------- */
function Nova({ group }) {
  return (
    <View style={CSS.section}>
      <View style={CSS.row}>
        <Text style={Typography.h3}>Nova :</Text>

        {/* Icone information */}
        <TouchableOpacity
          style={CSS.nova_information_icon}
          onPress={function () {
            Alert.alert(
              "Nova score",
              "La classification NOVA attribue un groupe aux produits alimentaires, classee de 1 a 4 en fonction de la quantite de transformation qu'ils ont subie.",
            );
          }}
        >
          <Icon name="information-outline" size={28} color={Colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Carre Nova */}
      <View style={CSS.nova_container}>
        <Text style={CSS.nova_text}>NOVA</Text>
        <View
          style={[CSS.nova_square, { backgroundColor: Colors.nova[group] }]}
        >
          <Text style={CSS.nova}>{group}</Text>
        </View>
      </View>
    </View>
  );
}

/* ----------------------------- Labels et tags ----------------------------- */
function LabelsAndTags({ ingredients, labels }) {
  // Recuperation des tags connus
  const tags = ingredients.filter((ingredient) => isKnownTag(ingredient));

  // Retourne vrai si l'ingredient est connu
  function isKnownTag(tag) {
    switch (tag) {
      case "en:palm-oil-free":
      case "en:palm-oil":
      case "en:vegetarian":
      case "en:vegan":
        return true;
      default:
        return false;
    }
  }

  // Si aucun tag alors retoruner null
  if (tags.length === 0) return null;
  else
    return (
      <View style={CSS.section}>
        <View style={CSS.row}>
          <Text style={Typography.h3}>Labels :</Text>

          {/* Icone information */}
          <TouchableOpacity
            style={CSS.nova_information_icon}
            onPress={function () {
              Alert.alert(
                "Informations",
                [
                  "\nBio: Certifie issu de l'agriculture biologique",
                  "Vegan: Qui exclus tout produit d'origine animale",
                  "Vegetarien: Qui exclus toute viande animale",
                  "Huile de palme: Huile vegetale possedant des effets tangibles sur la sante des individus et de la planete (source: OMS)",
                ].join("\n\n"),
              );
            }}
          >
            <Icon name="information-outline" size={28} color={Colors.gray} />
          </TouchableOpacity>
        </View>
        <View style={CSS.row}>
          {/* Bio */}
          {labels.indexOf("en:organic") >= 0 && (
            <View
              style={[CSS.pill, { backgroundColor: Colors.green }]}
            >
              <Icon name="leaf" size={20} color="white" />
              <Text style={CSS.pill_text}>Bio</Text>
            </View>
          )}

          {/* Etiquettes */}
          {tags.map((ingredient, index) => {
            switch (ingredient) {
              // Sans huile de palme
              case "en:palm-oil-free":
                return (
                  <View
                    key={"labelPill_" + index}
                    style={[CSS.pill, { backgroundColor: "#22a149" }]}
                  >
                    <Entypo name="check" size={20} color="white" />
                    <Text style={CSS.pill_text}>Sans huile de palme</Text>
                  </View>
                );

              // Huile de palme
              case "en:palm-oil":
                return (
                  <View
                    key={"labelPill_" + index}
                    style={[CSS.pill, { backgroundColor: Colors.red }]}
                  >
                    <Ionicons name="ios-water" size={20} color="white" />
                    <Text style={CSS.pill_text}>huile de palme</Text>
                  </View>
                );

              // Vegetarien
              case "en:vegetarian":
                return (
                  <View
                    key={"labelPill_" + index}
                    style={[CSS.pill, { backgroundColor: Colors.light_green }]}
                  >
                    <Icon name="egg" size={20} color={Colors.white} />
                    <Text style={CSS.pill_text}> Vegetarien </Text>
                  </View>
                );

              // Vegan
              case "en:vegan":
                return (
                  <View
                    key={"labelPill_" + index}
                    style={[CSS.pill, { backgroundColor: "#507c19" }]}
                  >
                    <Icon name="flower-tulip" size={20} color={Colors.white} />
                    <Text style={CSS.pill_text}>Vegan</Text>
                  </View>
                );

              default:
                return null;
            }
          })}
        </View>
      </View>
    );
}

const CSS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  inner: {
    padding: 16,
  },

  section: {
    marginBottom: 16,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  ingredients: {
    marginVertical: 8,
  },

  nova_container: {
    marginLeft: 16,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  nova_square: {
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    width: 46,
  },

  nova_text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.gray,
  },

  nova: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.white,
    textTransform: "uppercase",
  },

  nova_information_icon: {
    marginLeft: 8,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },

  pill: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 4,
    marginRight: 4,
    borderRadius: 100,
    backgroundColor: Colors.light_gray,
  },

  pill_text: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.white,
    marginLeft: 8,
  },
});

/* --------------------------------- Export --------------------------------- */
function mapStateToProps(state) {
  return {
    email: state.email,
    token: state.token,
  };
}

export default connect(mapStateToProps)(ProductScreen);
