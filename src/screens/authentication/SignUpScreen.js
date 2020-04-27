import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { YContainer, YButton, YTextInput, YLoader } from "../../components";
import * as SecureStore from "expo-secure-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../styles";
import { ROUTES } from "../../utils";
import { connect } from "react-redux";
import { changer_infos } from "../../../store";
import { createStackNavigator } from "react-navigation-stack";
import ProfileFormScreen from "../application/ProfileFormScreen";

function SignUp(props) {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  function signUp() {
    // Si un champ est vide
    if (!email || !password1 || !password2) {
      Alert.alert("Veuillez remplir tous les champs");
      return;
    }

    // Si mot de passe differents
    if (password1 !== password2) {
      Alert.alert("😡 Mots de passe differents");
      return;
    }

    // Si l'adresse email est invalide
    // Regex de format d'email valide
    const valid_email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.length < 254 && valid_email.test(email) === false) {
      Alert.alert("😡 Entrez une adresse email valide");
      return;
    }

    // Si le mot de passe fait moins de 6 caracteres
    if (password1.length < 6) {
      Alert.alert("😡 Veuillez saisir un mot de passe d'au moins 6 caracteres");
      return;
    }

    // Sinon faire une requête vers le serveur pour l'inscrire
    const body = JSON.stringify({
      email: email.toLowerCase(),
      password: password1,
    });

    setLoading(true);

    fetch(ROUTES.SIGN_UP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then((res) => res.json())
      .then((res) => (res.ok ? res.token : null))
      .then((token) => {
        setLoading(false);

        // L'inscription a echoue
        if (!token) {
          Alert.alert("Desole", "Email deja existant");
          return;
        }

        // Si l'inscription s'est bien effectuee, alors sauvegarder son mail dans le stockage interne
        SecureStore.setItemAsync("yakoi__credentials", body).then(() =>
          console.log("Se souvenir de moi ACTIVE"),
        );

        // Mettre a jour redux
        props.changer_infos({ email: email.toLowerCase(), token });

        // Navigation vers l'application
        props.navigation.navigate("NewProfile", { new: true });
      })
      .catch((err) => Alert.alert("Aïe", "Une erreur s'est produite: " + err));
  }

  return (
    <YContainer>
      <Text style={CSS.source}>Photo de Taylor Kiser sur Unsplash</Text>
      <ImageBackground
        style={CSS.container}
        source={require("../../assets/background/SALAD.jpg")}
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
            <Text style={CSS.heading}>S'inscrire</Text>
            <Text style={CSS.caption}>
              Retrouvez des milliers de produits facilement et partout a l'aide
              de votre compte
            </Text>
            <YTextInput
              type="email"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <YTextInput
              secure
              placeholder="Mot de passe (min 6 carac.)"
              value={password1}
              onChangeText={setPassword1}
            />
            <YTextInput
              secure
              placeholder="Confirmation de mot de passe"
              value={password2}
              onChangeText={setPassword2}
            />
            {loading ? (
              <YLoader />
            ) : (
              <YButton title="Rejoindre" onPress={signUp} />
            )}
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

/* --------------------------------- Export --------------------------------- */
const SignUpScreen = createStackNavigator({
  SignUp: {
    screen: connect(null, { changer_infos })(SignUp),
    navigationOptions: {
      headerShown: false,
    },
  },

  NewProfile: {
    screen: ProfileFormScreen,
    navigationOptions: {
      title: "Creer votre profil",
      headerLeft: () => <View />,
    },
  },
});

export default SignUpScreen;
