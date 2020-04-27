import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert,
  Picker,
  ScrollView,
} from "react-native";
import { Colors } from "../../styles";
import { YTextInput, YButton, YLoader, YOptionGroup } from "../../components";
import { connect } from "react-redux";
import { changer_infos } from "../../../store";
import { ROUTES, formatQuantity } from "../../utils";

function ProfileFormScreen(props) {
  // Contexte dans lequel la page est affiche: si NEW est false alors on est dans un contexte de modification
  const isNew = props.navigation.getParam("new");

  // Recuperer les informations de l'utilisateur deja connues ou par defaut
  const [lastname, setLastname] = useState(props.lastname); // Prenom, requis
  const [gender, setGender] = useState(props.gender || "m"); // Sexe
  const [dob, setDob] = useState(props.dob ? props.dob.toString() : ""); // Date
  const [height, setHeight] = useState(
    props.height ? props.height.toString() : "",
  );
  const [weight, setWeight] = useState(
    props.weight ? props.weight.toString() : "",
  );
  const [activity, setActivity] = useState(props.activity || 1.2); // Sedentaire par defaut
  const [loading, setLoading] = useState(false);

  /**
   * Fontion mettant a jour les donnees de l'utilisateur
   * dans la base de donnees et dans le store
   */
  function handleSubmit() {
    // Cas ou les infos requises n'ont pas ete saisies
    if (!lastname || !dob || !height || !weight) {
      Alert.alert("Attention", "Veuillez verifier vos informations saisis");
      return;
    }

    // Infos de l'utilisateur
    const informations = {
      lastname,
      dob: (dob && dob > 0) ? dob : 1990,
      gender,
      height: (height && height > 0) ?  height : 175,
      weight: (weight && weight > 0) ? weight : 75,
      activity,
    };

    setLoading(true);

    // Requete pour mettre a jour les donnees avec les informations saisies
    fetch(ROUTES.INFORMATIONS(props.email), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(informations),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          setLoading(false);

          // Naviguer vers l'application si nouvel utilisateur
          if (isNew) {
            Alert.alert(
              `Enchante ${lastname} !`,
              "Scannez des produits et ajoutez les a votre consommation des maintenant",
            );
            props.navigation.navigate("Application");
          }

          // Sinon, Naviguer vers la page precedente
          else {
            Alert.alert("C'est fait !", "Vos informations ont ete mis a jour");

            props.navigation.goBack();
          }

          // Mettre a jour les informations de l'utilisateur
          props.changer_infos(informations);
        }

        // En cas d'erreur
        else {
          setLoading(false);

          Alert.alert(
            "Aïe !",
            "Une erreur s'est produite lors de la sauvegarde de vos donnees",
          );
        }
      })
      .catch((err) => {
        console.log(err);

        Alert.alert(
          "Aïe !",
          "Une erreur s'est produite lors de la sauvegarde de vos donnees",
        );
      });
  }

  return (
    <ScrollView style={CSS.container}>
      <View style={CSS.inner}>
        <View style={CSS.input_section}>
          <InputGroup
            label="Prenom"
            value={lastname}
            onChangeText={setLastname}
          />
          <InputGroup
            label="Annee de naissance"
            placeholder="ex: 1990"
            type="number"
            value={dob}
            onChangeText={setDob}
          />
          <InputGroup
            label="Taille (en cm)"
            placeholder="ex: 175"
            type="number"
            value={height}
            onChangeText={setHeight}
          />
          <InputGroup
            label="Poids (en kg)"
            placeholder="ex: 75"
            type="number"
            value={weight}
            onChangeText={setWeight}
          />

          <View style={CSS.input_group}>
            <Text style={CSS.input_label}>Sexe</Text>
            <YOptionGroup
              options={["Homme", "Femme"]}
              option={gender === "f" ? "Femme" : "Homme"}
              setOption={(sexe) => {
                // Mise a jour du sexe
                setGender(sexe === "Femme" ? "f" : "m");
              }}
            />
          </View>

          <View style={CSS.input_group}>
            <Text style={CSS.input_label}>
              Niveau d'activite sportive hebdomadaire
            </Text>
            <Picker
              selectedValue={activity}
              onValueChange={(currentAct) => setActivity(currentAct)}
            >
              <Picker.Item
                label="Sedentaire (aucune activitee sportive)"
                value={1.2}
              />
              <Picker.Item
                label="Legerement actif (1 à 2 entrainements)"
                value={1.375}
              />
              <Picker.Item label="Actif (3 à 4 entrainements)" value={1.55} />
              <Picker.Item
                label="Tres actif (un entrainement quotidien)"
                value={1.725}
              />
            </Picker>
          </View>

          {loading ? (
            <YLoader />
          ) : (
            <YButton title="Sauvegarder" onPress={handleSubmit} />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

/**
 * Composant intermediaire pour la saisie des infos.
 * Similaire a YTextInput
 */
function InputGroup({
  label,
  placeholder = "",
  type,
  value,
  onChangeText,
  secure,
}) {
  return (
    <View style={CSS.input_group}>
      <Text style={CSS.input_label}>{label}</Text>
      <YTextInput
        secure={secure}
        type={type}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const CSS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },

  section_header: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.orange,
  },

  input_group: {
    marginVertical: 8,
  },

  input_label: {
    marginBottom: 4,
  },

  button_group: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

/* --------------------------------- Export --------------------------------- */
// Recupertion de tout le state
function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, { changer_infos })(ProfileFormScreen);
