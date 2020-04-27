import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { YLoader } from "../../components";
import { connect } from "react-redux";
import { changer_infos } from "../../../store";
import { ROUTES } from "../../utils";

function Loading(props) {
  useEffect(() => {
    // Recherche de l'email et du mot de passe dans le stockage interne
    SecureStore.getItemAsync("yakoi__credentials")
      // Si trouve alors faire une requete pour se connecter
      .then((credentials) => {
        if (credentials) {
          return fetch(ROUTES.LOGIN, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: credentials,
          });
        } else throw new Error("Never logged in");
      })
      .then((res) => res.json())
      .then((res) => {
        // Si echec de connexion
        if (!res.ok) throw new Error("Login failed");

        // Sinon mettre a jour le store avec les informations recues
        props.changer_infos({
          token: res.token,
          ...res.informations,
        });

        // et naviguer vers l'application
        props.navigation.navigate("Application");
      })

      // En cas d'erreur, naviguer vers la page d'Acceuil
      .catch((err) => {
        console.log(err);
        props.navigation.navigate("Introduction");
      });
  }, []);

  return (
    <View style={CSS.container}>
      <YLoader />
      <Text>Recuperation de vos informations...</Text>
    </View>
  );
}

const CSS = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

/* --------------------------------- Export --------------------------------- */
export default connect(null, { changer_infos })(Loading);
