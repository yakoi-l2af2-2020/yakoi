import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { withNavigationFocus } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { ROUTES } from "../../utils";
import { connect } from "react-redux";
import { YLoader, YProduct, YIconButton, YEmptyList } from "../../components";
import { Colors } from "../../styles";
import FavoritesScreen from "./FavoritesScreen";
import ProductScreen from "./ProductScreen";

function History(props) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (props.isFocused) {
      /** Recuperation de l'historique
       * a chaque fois que l'utilisteur se rend sur cet onglet */
      fetch(ROUTES.HISTORY(props.email), {
        headers: {
          Authorization: "Bearer " + props.token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);

          const resHistory = res.history;

          // Trier par date de scan
          resHistory.sort((a, b) => {
            const scan_timeA = new Date(a.scan_time);
            const scan_timeB = new Date(b.scan_time);
            return scan_timeB - scan_timeA;
          });

          setHistory(resHistory);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  }, [props.isFocused]);

  /** Acces a la page des favoris a partir de l'historique */
  function goToFavorites() {
    const favorites = history.filter((product) => product.favorite);

    props.navigation.push("Favorites", {
      favorites,
    });
  }

  if (!props.isFocused) return <View />;

  if (loading) {
    return (
      <View style={CSS.container}>
        <YLoader />
      </View>
    );
  } else {
    return (
      <View style={CSS.container}>
        {/*Affichage du nombres de produits present dans l'historique 
          et du bouton pour acceder au favoris */}
        <View style={CSS.header}>
          <Text style={CSS.heading}>
            {history.length} {history.length === 1 ? "produit" : "produits"}
          </Text>
          <YIconButton
            name="star"
            color={Colors.yellow}
            bgColor={Colors.white}
            size={28}
            onPress={goToFavorites}
          />
        </View>

        <FlatList
          data={history}
          renderItem={function (element) {
            const product = element.item;

            return (
              <View style={{ marginHorizontal: 16 }}>
                <YProduct
                  {...product}
                  onPress={function () {
                    props.navigation.push("ProductScreen", {
                      product,
                    });
                  }}
                />
              </View>
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
    backgroundColor: Colors.white,
    justifyContent: "center",
  },

  header: {
    padding: 16,
    flexDirection: "row",
  },

  heading: {
    flex: 1,
    fontSize: 28,
    fontWeight: "bold",
    marginRight: 8,
  },
});

/* --------------------------------- Export --------------------------------- */
function mapStateToProps(state) {
  return {
    email: state.email,
    token: state.token,
  };
}

const HistoryScreen = createStackNavigator({
  History: {
    screen: connect(mapStateToProps)(withNavigationFocus(History)),
    navigationOptions: {
      title: "Historique",
    },
  },
  Favorites: {
    screen: FavoritesScreen,
    navigationOptions: {
      title: "Favoris",
    },
  },
  ProductScreen: {
    screen: ProductScreen,
    navigationOptions: {
      title: "Fiche produit",
    },
  },
});

export default HistoryScreen;
