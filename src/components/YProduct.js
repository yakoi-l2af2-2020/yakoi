import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../styles";


/**
 * Composant affichant un rectangle 
 * contenant les informations pricipales d'un produit.
 * @param {string} [props.name=Produit Anonyme] - Nom du produit
 * @param {string} [props.brand] - Marque du produit
 * @param {number} [props.quantity] - Marque du produit
 * @param {number} [props.calories] - Nombre de calories en kCal
 * @param {string} [props.nutriscore] - Nutriscore
 * @param {string} [props.image_url] - Miniature, lien vers l'image du produit
 * @param {Function} props.onPress - Fonction execute lors d'un appui court
 * @param {Function} props.onLongPress - Fonction execute lors d'un appui long
 */
function YProduct({
  name = "Produit anonyme",
  brand,
  quantity,
  calories,
  nutriscore,
  image_url,
  onPress = function () {},
  onLongPress = function () {},
}) {
  // Image par default: APPLE_ICON.ong
  const image_source = image_url
    ? { uri: image_url }
    : require("../assets/icons/APPLE_ICON.png");

  // Gestion des couleurs selon le nutriscore
  const nutriscore_color = Colors.nutriscore[nutriscore]
    ? Colors.nutriscore[nutriscore]
    : Colors.gray;

  const dynamicBackground = {
    borderWidth: Colors.nutriscore[nutriscore] ? 1 : 1,
    borderColor: Colors.nutriscore[nutriscore] ? nutriscore_color : Colors.gray,

    // Transformation de RGB en RGBA
    backgroundColor: Colors.nutriscore[nutriscore]
      ? nutriscore_color.replace("rgb", "rgba").replace(")", ", 0.16)")
      : "#eee",
  };

  return (
    <View style={[CSS.container, dynamicBackground]}>
      <TouchableOpacity
        style={CSS.content}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        {/* Miniature */}
        <View style={CSS.miniature__container}>
          <View style={{ flex: 1 }}>
            <Image style={CSS.miniature} source={image_source} />
          </View>
        </View>

        {/* Informations */}
        <View style={CSS.informations}>
          <Text numberOfLines={2} style={CSS.product__name}>
            {name}
          </Text>

          {brand ? (
            <Text numberOfLines={1} style={CSS.product__brand}>
              {brand}
            </Text>
          ) : null}

          {quantity ? (
            <Text style={CSS.product__info}>{quantity.toString()}</Text>
          ) : null}

          {calories && calories > 0 ? (
            <Text style={CSS.product__info}>{calories} kcal</Text>
          ) : null}
        </View>

        {/* Nutriscore */}
        {nutriscore && (
          <View style={CSS.nutriscore__container}>
            <View
              style={[
                CSS.nutriscore__ball,
                { backgroundColor: nutriscore_color },
              ]}
            >
              <Text
                style={[
                  CSS.nutriscore,
                  { color: nutriscore ? Colors.white : Colors.black },
                ]}
              >
                {nutriscore}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const CSS = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.light_gray,
    backgroundColor: Colors.white,
    marginVertical: 4,
    borderRadius: 6,
  },

  content: {
    paddingHorizontal: 16,
    paddingVertical: 8 + 4,
    flexDirection: "row",
  },

  miniature__container: {
    width: 76 * 1.1, // taille de la miniature
    marginRight: 16,
  },

  miniature: {
    flex: 1,
    resizeMode: "contain",
    height: undefined,
    width: undefined,
  },

  informations: {
    flex: 1,
  },

  product__name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  product__brand: {
    fontSize: 12,
  },

  product__info: {
    fontSize: 14,
  },

  nutriscore__container: {
    marginLeft: 12,
    justifyContent: "center",
  },

  nutriscore__ball: {
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    width: 46,
    borderRadius: 100,
  },

  nutriscore: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default YProduct;
