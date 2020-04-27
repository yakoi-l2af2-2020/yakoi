import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import { YContainer, YTextInput, YButton, YLoader } from "../../components";
import { Colors } from "../../styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ROUTES } from "../../utils";

function ForgotPassword(props) {
  const [email, setEmail] = useState(props.navigation.getParam("email") || "");
  const [loading, setLoading] = useState(false);

  function sendPassword() {
    // Si l'email saisie est vide ou invalide
    const valid_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email && valid_email.test(email) === false) {
      Alert.alert("😡 Entrez une adresse email valide");
      return;
    }

    setLoading(true);

    // Faire une requete pour demander l'envoi d'un nouveau mot de passe
    fetch(ROUTES.PASSWORD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase() }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);

        // Si mail envoye correctement
        if (res.ok) {
          Alert.alert(
            "Message envoye !",
            "Un mail contenant votre nouveau mot de passe a ete envoye",
          );
        }

        // En cas d'erreur
        else {
          Alert.alert("Echec !", "Le mail n'a pu etre envoye");
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);

        setLoading(false);

        Alert.alert("Aie", "Une erreur s'est produite : " + err);
      });
  }

  return (
    <YContainer>
      <Text style={CSS.source}>Photo de Fathul Abrar sur Unsplash</Text>
      <ImageBackground
        style={CSS.container}
        source={require("../../assets/background/CEREALS.jpg")}
        imageStyle={{ opacity: 0.67 }}
      >
        <View style={CSS.header}>
          <TouchableOpacity
            style={CSS.icon}
            onPress={() => props.navigation.navigate("Login")}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              color={Colors.orange}
              size={28}
            />
          </TouchableOpacity>
        </View>
        <View style={CSS.paper_container}>
          <View style={CSS.paper}>
            <Text style={CSS.heading}>Mot de passe oublie ?</Text>
            <Text style={CSS.caption}>
              Saisissez votre email pour recevoir un nouveau mot de passe
            </Text>
            <Text style={CSS.caption}>
              Vous pourrez le changer plus tard dans l'onglet Profil
            </Text>
            <YTextInput
              type="email"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            {
              // Masquer le bouton pendant la requete
              loading ? (
                <YLoader />
              ) : (
                <YButton title="Envoyer" onPress={sendPassword} />
              )
            }
          </View>
        </View>
      </ImageBackground>
    </YContainer>
  );
}

const CSS = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 20 : 0,
    height: Dimensions.get("window").height,
  },

  header: {
    paddingTop: 32,
    paddingHorizontal: 32,
    alignItems: "flex-start",
  },

  icon: {
    padding: 8,
    borderRadius: 100,
    backgroundColor: Colors.white,
  },

  paper_container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  paper: {
    padding: 32,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: Colors.white,
  },

  heading: {
    marginBottom: 16,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.orange,
  },

  caption: {
    marginBottom: 8,
    textAlign: "center",
    color: Colors.gray,
  },

  source: {
    position: "absolute",
    zIndex: 1000,
    top: 40,
    right: 10,
    fontSize: 10,
  },
});

export default ForgotPassword;
