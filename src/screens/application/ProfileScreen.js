import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import { YButton } from "../../components";
import { Colors } from "../../styles";
import { MaterialIcons } from "@expo/vector-icons";
import { createStackNavigator } from "react-navigation-stack";
import { connect } from "react-redux";
import * as SecureStore from "expo-secure-store";
import ProfileFormScreen from "./ProfileFormScreen";
import PasswordFormScreen from "./PasswordFormScreen";
import { reinitialiser } from "../../../store";

function Profile(props) {
  // Déconnecte l'utilisateur
  function logout() {
    props.reinitialiser();

    /** Suppression de ses informations du stockage interne*/
    SecureStore.deleteItemAsync("yakoi__credentials").then(() =>
      props.navigation.navigate("Start"),
    );
  }

  /** Navigue vers la page de modification du profil */
  function goToModifyProfile() {
    props.navigation.navigate("ModifyProfile");
  }

  /** Navigue vers la page de modification du mot de passe */
  function goToModifyPassword() {
    props.navigation.navigate("ModifyPassword");
  }

  return (
    <ScrollView style={CSS.container}>
      <View style={CSS.inner}>
        <Header
          lastname={props.lastname}
          gender={props.gender}
          email={props.email}
          dob={props.dob}
        />

        <Informations {...props} />

        <YButton title="Modifier" onPress={goToModifyProfile} />
        <YButton secondary title="Deconnexion" onPress={logout} />
        <YButton
          secondary
          title="Changer de mot de passe"
          onPress={goToModifyPassword}
        />
      </View>
    </ScrollView>
  );
}

/**
 * Affiche les informations principales en en-tete
 * @param {string} firstname - Prenom
 * @param {string} email - Email
 * @param {string} gender - Sexe ("m" ou "f")
 * @param {strig} dob - Annee de naissance
 */
function Header({ lastname, email, gender, dob }) {
  const age = new Date().getFullYear() - dob;

  return (
    <View style={CSS.header}>
      {/*Affiche une icone d'avatar en fonction du sexe*/}
      <Image
        style={CSS.avatar}
        source={
          gender === "f"
            ? require("../../assets/icons/FEMALE_AVATAR.png")
            : require("../../assets/icons/MALE_AVATAR.png")
        }
      />
      <View style={CSS.header_informations}>
        {lastname ? <Text style={CSS.name}>{lastname}</Text> : null}
        <Text>{email}</Text>
        {age.length ? <Text>{age} ans</Text> : null}
      </View>
    </View>
  );
}

/**
 * Affiche les informations secondaires dans une liste déroulante
 * @param {string} gender - Sexe
 * @param {number|string} height - Taille en cm
 * @param {number|string} gender - Poids en kg
 */
function Informations({ gender, height, weight }) {
  const [expanded, setExpanded] = useState(true);

  const IMC = Math.round(weight / ((height / 100) * (height / 100)));

  return (
    <View style={CSS.table}>
      <TouchableOpacity
        style={CSS.table_head}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={CSS.table_header}>Vos informations</Text>
        <View>
          <MaterialIcons
            name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={28}
            color={Colors.orange}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View>
          {gender && (
            <TableRow label="Sexe" value={gender === "m" ? "Homme" : "Femme"} />
          )}
          {height && (
            <TableRow label="Taille" value={(height / 100).toFixed(2) + " m"} />
          )}
          {weight && (
            <TableRow label="Poids" value={Number(weight).toFixed(2) + " kg"} />
          )}
          {height && weight && (
            <View style={CSS.row}>
              <Text style={CSS.label}>IMC</Text>
              <Text style={CSS.value}>{IMC}</Text>
              {/* Icone information */}
              <TouchableOpacity
                style={CSS.nova_information_icon}
                onPress={function () {
                  Alert.alert(
                    "Informations",
                    [
                      "\nIndice de Masse Corporel permettant de determiner la corpulence d'une personne.\n",
                      "Insuffisance ponderale: < 19",
                      "Corpulence normale: 19 - 25",
                      "Surpoids: 26 - 30",
                      "Obesite: > 30",
                    ].join("\n"),
                  );
                }}
              >
                <MaterialIcons
                  name="info-outline"
                  size={28}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

/**
 * Composant qui aligne les infos de la liste déroulante
 * @param {string} label - Libelle
 * @param {string|number} - Contenu, valeur
 */
function TableRow({ label, value }) {
  return (
    <View style={CSS.row}>
      <Text style={CSS.label}>{label}</Text>
      <Text style={CSS.value}>{value}</Text>
    </View>
  );
}

const CSS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  inner: {
    paddingHorizontal: 16,
  },

  header: {
    paddingVertical: 16,
    flexDirection: "row",
  },

  avatar: {
    height: 96,
    width: 96,
  },

  header_informations: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 16,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
  },

  table: {
    marginBottom: 16,
  },

  table_head: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  table_header: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light_gray,
  },

  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },

  value: {
    flex: 2,
    fontSize: 16,
  },
});

/* --------------------------------- Export --------------------------------- */
function mapStateToProps(state) {
  return state;
}

const ProfileScreen = createStackNavigator({
  Profile: {
    screen: connect(mapStateToProps, { reinitialiser })(Profile),
    navigationOptions: {
      title: "Profil",
    },
  },
  ModifyProfile: {
    screen: ProfileFormScreen,
    navigationOptions: {
      title: "Modifier mon profil",
    },
  },
  ModifyPassword: {
    screen: PasswordFormScreen,
    navigationOptions: {
      title: "Changer de mot de passe",
    },
  },
});

export default ProfileScreen;
