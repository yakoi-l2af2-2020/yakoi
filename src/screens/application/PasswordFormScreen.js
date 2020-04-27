import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert,
  Picker,
  ScrollView,
} from "react-native";
import { Colors, Typography } from "../../styles";
import { YTextInput, YButton, YContainer, YLoader } from "../../components";
import { connect } from "react-redux";
import { ROUTES } from "../../utils";

function PasswordFormScreen(props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);

  function changePassword() {
    if (!currentPassword || !password1 || !password2) return;

    // Si le mot de passe fait moins de 6 caracteres
    if (password1.length < 6) {
      Alert.alert("😡 Veuillez saisir un mot de passe d'au moins 6 caracteres");
      return;
    }

    // Si mot de passe differents
    if (password1 !== password2) {
      Alert.alert("😡 Mots de passe differents");
      return;
    }

    setLoading(true);

    const body = JSON.stringify({
      email: props.email,
      currentPassword,
      newPassword: password1,
    });

    fetch(ROUTES.PASSWORD, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + props.token,
        "Content-Type": "application/json",
      },
      body,
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);

        if (res.ok) {
          Alert.alert(
            "✔ C'est fait !",
            "Votre mot de passe a ete correctement change",
          );

          goBack();
        } else {
          Alert.alert(
            "Echec !",
            "Votre mot de passe n'a pu être change, verifiez les informations saisies",
          );
        }
      });
  }

  function goBack() {
    props.navigation.goBack();
  }

  return (
    <YContainer>
      <View style={CSS.input_section}>
        <InputGroup
          label="Mot de passe actuel"
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <InputGroup
          label="Nouveau mot de passe"
          placeholder="6 caracteres min."
          value={password1}
          onChangeText={setPassword1}
        />
        <InputGroup
          label="Confirmation de mot de passe"
          placeholder="6 caracteres min."
          value={password2}
          onChangeText={setPassword2}
        />

        {loading ? (
          <YLoader />
        ) : (
          <View style={CSS.button_group}>
            <YButton title="Valider" onPress={changePassword} />
            <YButton secondary title="Annuler" onPress={goBack} />
          </View>
        )}
      </View>
    </YContainer>
  );
}

function InputGroup({ label, placeholder = "", value, onChangeText }) {
  return (
    <View style={CSS.input_group}>
      <Text style={CSS.input_label}>{label}</Text>
      <YTextInput
        secure
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const CSS = StyleSheet.create({
  input_section: {
    paddingHorizontal: 16,
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
    // flexDirection: "row",
    // justifyContent: "center",
  },
});

/* --------------------------------- Export --------------------------------- */
function mapStateToProps(state) {
  return {
    email: state.email,
    token: state.token,
  };
}

export default connect(mapStateToProps)(PasswordFormScreen);
