import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  ImageBackground,
  Dimensions,
  Alert,
  Keyboard,
  Animated,
} from "react-native";
import { YContainer, YTextInput, YButton, YLoader } from "../../components";
import * as SecureStore from "expo-secure-store";
import { Colors } from "../../styles";
import { ROUTES } from "../../utils";
import { connect } from "react-redux";
import { changer_infos } from "../../../store";

function LoginScreen(props) {
  /* ------------------------------- Animation ------------------------------ */
  // Detecter si le clavie est affiche ou non pour animer la taille du logo
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", shrinkLogo);
    Keyboard.addListener("keyboardDidHide", growLogo);

    return () => {
      Keyboard.removeListener("keyboardDidShow");
      Keyboard.removeListener("keyboardDidHide");
    };
  }, []);

  const LOGO_MAX = 256,
    LOGO_MIN = 64,
    DURATION = 150;
  const LogoAnimation = new Animated.Value(LOGO_MAX);
  function shrinkLogo() {
    Animated.timing(LogoAnimation, {
      toValue: LOGO_MIN,
      duration: DURATION,
    }).start();
  }

  function growLogo() {
    Animated.timing(LogoAnimation, {
      toValue: LOGO_MAX,
      duration: DURATION * 2,
    }).start();
  }
  /* ------------------------------------------------------------------------ */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function login() {
    if (!email || !password) return;

    setLoading(true);

    const body = JSON.stringify({ email, password });

    // Faire une requete pour se connecter
    fetch(ROUTES.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);

        // Si echec lors de la connexion
        if (!res.ok) {
          Alert.alert(
            "Desole",
            "Il semblerait que les informations saisies ne sont pas correctes",
          );
        } else {
          // Si la connexion s'est bien effectuee
          // alors sauvegarder son mail dans le stockage interne
          SecureStore.setItemAsync("yakoi__credentials", body).then(() =>
            console.log("Se souvenir de moi ACTIVE"),
          );

          // Navigation vers l'application
          props.navigation.navigate("Application");

          // Mettre a jour redux avec les informations recues
          props.changer_infos({
            token: res.token,
            ...res.informations,
          });
        }
      })

      // En cas d'erreur
      .catch((err) => {
        setLoading(false);
        Alert.alert("Aïe !", "Une erreur s'est produite :" + err);
      });
  }

  function goToSignUp() {
    props.navigation.navigate("SignUp");
  }

  function goToForgotPassword() {
    props.navigation.navigate("ForgotPassword", {
      email,
    });
  }

  return (
    <YContainer>
      <Text style={CSS.source}>Photo de Heather Ford sur Unsplash</Text>
      <ImageBackground
        source={require("../../assets/background/PASTA.jpg")}
        style={CSS.container}
        imageStyle={{ opacity: 0.67 }}
      >
        <View style={CSS.header}>
          <Animated.View
            style={{
              height: LogoAnimation,
              width: LogoAnimation,
            }}
          >
            <Image
              source={require("../../assets/YAKOI_LOGO.png")}
              style={{
                flex: 1,
                height: undefined,
                width: undefined,
              }}
            />
          </Animated.View>
        </View>

        <View style={CSS.paper_container}>
          <View style={CSS.paper}>
            <Text style={CSS.heading}>Se connecter</Text>

            <YTextInput
              placeholder="Email"
              type="email"
              value={email}
              onChangeText={setEmail}
            />
            <YTextInput
              placeholder="Mot de passe"
              secure
              value={password}
              onChangeText={setPassword}
            />
            {loading ? (
              <YLoader />
            ) : (
              <View>
                <YButton title="Connexion" onPress={login} />
                <YButton secondary title="S'inscrire" onPress={goToSignUp} />
                <Text style={CSS.link} onPress={goToForgotPassword}>
                  Mot de passe oublie ?
                </Text>
              </View>
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
    flex: 1,
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
  },

  heading: {
    marginBottom: 16,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.orange,
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

  link: {
    alignSelf: "center",
    paddingBottom: 4,
    color: Colors.orange,
    textAlign: "center",
    borderBottomColor: Colors.orange,
    borderBottomWidth: 1,
  },

  source: {
    position: "absolute",
    zIndex: 1000,
    top: 40,
    right: 10,
    fontSize: 10,
  },
});

/* --------------------------------- EXPORT --------------------------------- */
export default connect(null, { changer_infos })(LoginScreen);
