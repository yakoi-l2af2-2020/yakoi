import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ImageBackground,
  Alert,
} from "react-native";
import { YButton } from "../../components";
import { Colors } from "../../styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";

function IntroductionScreen(props) {
  async function goToAuthentication() {
    const networkState = await NetInfo.fetch();

    if (networkState.isConnected) props.navigation.navigate("Authentication");
    else Alert.alert("Aucune connexion Internet", "Verifiez votre connexion");
  }

  return (
    <View style={CSS.container}>
      <Text style={CSS.source}>Photo de Bruna Branco sur Unsplash</Text>
      <ImageBackground
        style={CSS.background_image}
        source={require("../../assets/background/ORANGES.jpg")}
      >
        <View style={CSS.paper}>
          <View style={CSS.header}>
            <Text style={CSS.heading}>Bienvenu sur Yakoi !</Text>
            <Text style={CSS.caption}>
              Scannez et retrouvez des milliers de produits avec un simple geste
            </Text>
          </View>

          <View style={CSS.features}>
            <FeatureItem iconName="barcode-scan" text="Scan de code-barres" />

            <FeatureItem iconName="chart-donut" text="Analyse des aliments" />
            <FeatureItem
              iconName="food-variant"
              text="Suivi de votre consommation"
            />
            <FeatureItem
              iconName="account-circle"
              text="1 compte pour tous vos appareils"
            />
          </View>

          <View>
            <YButton title="Decouvrir" onPress={goToAuthentication} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

function FeatureItem({ iconName, text }) {
  return (
    <View style={CSS.feature_item}>
      <View style={CSS.feature_icon}>
        <MaterialCommunityIcons
          name={iconName}
          color={Colors.orange}
          size={22}
        />
      </View>
      <Text style={CSS.feature_text}>{text}</Text>
      <View>
        <MaterialCommunityIcons name="check" color={Colors.green} size={18} />
      </View>
    </View>
  );
}

const CSS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  background_image: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 16 + 16 : 16,
    justifyContent: "flex-end",
  },

  paper: {
    padding: 32,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: Colors.white,
  },

  header: {
    marginBottom: 16,
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.orange,
    textAlign: "center",
  },

  caption: {
    textAlign: "center",
    color: Colors.gray,
  },

  features: {
    marginVertical: 8,
  },

  feature_item: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light_gray,
  },

  feature_icon: {
    paddingRight: 16,
  },

  feature_text: {
    flex: 1,
  },

  source: {
    position: "absolute",
    zIndex: 1000,
    top: 40,
    right: 10,
    fontSize: 10,
  },
});

export default IntroductionScreen;
