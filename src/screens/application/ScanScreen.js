import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { YTextInput, YIconButton, YContainer } from "../../components";
import { Camera } from "expo-camera";
import { Colors } from "../../styles";
import { withNavigationFocus } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { connect } from "react-redux";
import { getProduct, formatProductData, ROUTES } from "../../utils";
import ProductScreen from "./ProductScreen";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import ConsumptionFormScreen from "./ConsumptionFormScreen";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function Scan(props) {
  const INITIAL_BARCODE = "3088540004440";
  const [barcode, setBarcode] = useState(INITIAL_BARCODE);
  const [searching, setSearching] = useState(false);

  // State de la camera
  const [hasPermission, setHasPermission] = useState(null);
  const [torch, setTorch] = useState(false);

  // Demander la permission pour la camera au demarrage
  useEffect(function () {
    async function requestCameraPermission() {
      const autorisation = await Camera.requestPermissionsAsync();
      setHasPermission(autorisation.granted);
    }

    requestCameraPermission()
      // En cas d'erreur
      .catch((err) => {
        console.log(err);

        Alert.alert(
          "Une erreur s'est produite",
          "Impossible d'acceder a la camera",
        );
      });
  }, []);

  /**
   * Fonction mettant a jour le code-barres avec le code-barres scanne
   * @param {object} barcode Objet code-barres
   * @param {string} barcode.type Type de code-barres
   * @param {string} barcode.data Valeur du code-barres scanne
   */
  function handleBarCodeScan(scannedBarcode) {
    if (scannedBarcode.data !== barcode) {
      setBarcode(scannedBarcode.data);

      // Vibrer pour signaler le scan
      Vibration.vibrate(200);
    }
  }

  /**
   * Recherche un produit a partir du code-barres scanne/saisi
   * et l'ajoute a l'historique de l'utilisateur
   */
  function handleSubmit() {
    if (!barcode) return;

    setSearching(true);

    // Recherche du produit
    getProduct(barcode)
      .then((product) => {
        setSearching(false);

        // Si aucun produit trouve
        if (product === null) {
          Alert.alert(
            "🤷‍♂️ Desole",
            "Aucun produit trouve avec le code-barres fourni",
          );
        }

        // Sinon, l'ajouter a l'historique et naviguer vers la fiche produit
        const formatedProduct = formatProductData(product);

        fetch(ROUTES.HISTORY(props.email), {
          method: "POST",
          headers: {
            Authorization: "Bearer " + props.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formatedProduct),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(
              res.ok
                ? "Produit ajoute a l'historique !"
                : "Erreur lors de l'ajout a l'historique",
            );
          });

        // Navigation vers la fiche produit
        props.navigation.push("ProductScreen", {
          product: formatedProduct,
        });
      })
      .catch((err) => {
        console.log(err);

        Alert.alert("Aie", "Une erreur s'est produite: " + err);

        setSearching(false);
      });
  }

  /**
   * Fonction qui agit comme un interrupteur sur la varible torch
   * afin d'allumer ou eteindre le flash
   */
  function toggleTorch() {
    setTorch(!torch);
  }

  // Permission accorde
  if (hasPermission && props.isFocused) {
    return (
      <YContainer>
        <View style={CSS.container}>
          <Camera
            style={{ flex: 1 }}
            onBarCodeScanned={handleBarCodeScan}
            flashMode={
              torch
                ? Camera.Constants.FlashMode.torch
                : Camera.Constants.FlashMode.off
            }
          >
            <View style={{ marginTop: 64, marginLeft: 32 }}>
              <YIconButton
                name="white-balance-sunny"
                onPress={toggleTorch}
                secondary={torch ? true : false}
              />
            </View>
            <BarcodeForm
              barcode={barcode}
              setBarcode={setBarcode}
              onSubmit={handleSubmit}
              pending={searching}
            />
          </Camera>
        </View>
      </YContainer>
    );
  }

  // Permission refuse
  else {
    return (
      <YContainer>
        <View style={CSS.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={CSS.container}>
              <BarcodeForm
                barcode={barcode}
                setBarcode={setBarcode}
                onSubmit={handleSubmit}
                pending={searching}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </YContainer>
    );
  }
}

/**
 * Composant permettant de saisir un code-barres.
 * Sa position s'adapte en fonction du clavier.
 */
function BarcodeForm({ barcode, setBarcode, onSubmit, pending, isFocused }) {
  const [alignement, setAlignement] = useState("flex-end");

  useEffect(() => {
    // Changer la position du champ de texte en fonction du clavier
    Keyboard.addListener("keyboardDidShow", () => setAlignement("flex-start"));
    Keyboard.addListener("keyboardDidHide", () => setAlignement("flex-end"));

    return () => {
      // Enlever le listener pour eviter les fuites de memoires
      Keyboard.removeAllListeners("keyboardDidShow");
      Keyboard.removeAllListeners("keyboardDidHide");
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: alignement }}>
      <View style={CSS.searchbar}>
        <View style={CSS.text_input_container}>
          <YTextInput
            type="number"
            placeholder="code-barres"
            value={barcode}
            onChangeText={setBarcode}
          />
        </View>
        <View>
          <TouchableOpacity
            style={CSS.icon}
            disabled={pending}
            onPress={onSubmit}
          >
            {pending ? (
              <MaterialCommunityIcons
                name="timer-sand"
                size={24}
                color={Colors.white}
              />
            ) : (
              <MaterialIcons name="search" size={24} color={Colors.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const CSS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  searchbar: {
    margin: 32,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 100,
  },
  text_input_container: {
    flex: 1,
    marginRight: 8,
  },
  icon: {
    height: 40,
    width: 40,
    backgroundColor: Colors.orange,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
});

/* --------------------------------- Export --------------------------------- */
function mapStateToProps(state) {
  return {
    email: state.email,
    token: state.token,
  };
}

const ScanScreen = createStackNavigator({
  Scan: {
    screen: connect(mapStateToProps)(withNavigationFocus(Scan)),
    navigationOptions: {
      headerShown: false
    }
  },
  ProductScreen: {
    screen: ProductScreen,
    navigationOptions: {
      title: "Fiche produit",
    },
  },
  ConsumptionForm: {
    screen: ConsumptionFormScreen,
    navigationOptions: {
      title: "Ajouter a ma consommation",
    },
  },
});

export default ScanScreen;
