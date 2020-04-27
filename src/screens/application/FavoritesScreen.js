import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { YProduct, YLoader, YEmptyList } from "../../components";
import { Colors } from "../../styles";
import { ROUTES } from "../../utils";
import { connect } from "react-redux";

function FavoritesScreen(props) {
  const favoritesParam = props.navigation.getParam("favorites");
  const [favorites, setFavorites] = useState(favoritesParam);
  const [loading, setLoading] = useState(false);

  /**
   * Demande a l'utilisateur de confirmer son choix de suppression
   * @param {string} _id - Identifiant MongoDB du produit
   * @param {*} index - Index du produit dans la liste de favoris
   */
  function promptOptions(_id, index) {
    // Alerte avec des options
    Alert.alert(
      "Attention !",
      "Voulez vous supprimez " + favorites[index].name + " de vos favoris ?",
      [
        {
          text: "Annuler",
        },
        {
          text: "Supprimer",
          onPress: () => deleteProduct(_id),
        },
      ],
      { cancelable: true },
    );
  }

  /**
   * Fonction permettant de supprimer un produit des favoris
   * @param {string} _id - Identifiant MongoDB du produit
   */
  function deleteProduct(_id) {
    setLoading(true);

    // Requete avec l'identifiant du produit
    fetch(ROUTES.FAVORITES(props.email), {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + props.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id }),
    })
      .then((res) => res.json())
      .then((res) => {
        // Si correctement effectue
        if (res.ok) {
          const newFavorites = favorites.filter((p) => p._id !== _id);
          setFavorites(newFavorites);

          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);

        Alert.alert("Aie", "Une erreur s'est produite: " + err);

        setLoading(false);
      });
  }

  if (loading) {
    return (
      <View style={CSS.container_loader}>
        <YLoader />
        <Text>Suppression en cours...</Text>
      </View>
    );
  } else {
    return (
      <View style={CSS.container}>
        <FlatList
          data={favorites}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={function (element) {
            const product = element.item;

            return (
              <YProduct
                {...product}
                onPress={function () {
                  props.navigation.push("ProductScreen", {
                    product,
                  });
                }}
                onLongPress={() => promptOptions(product._id, element.index)}
              />
            );
          }}
          keyExtractor={function (_, index) {
            return index.toString();
          }}
          ListEmptyComponent={YEmptyList}
        />
      </View>
    );
  }
}

const CSS = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: Colors.white,
  },

  container_loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
});

/* --------------------------------- Export --------------------------------- */
function mapStateToProps(state) {
  return {
    email: state.email,
    token: state.token,
  };
}

export default connect(mapStateToProps)(FavoritesScreen);
