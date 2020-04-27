import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Picker,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  YContainer,
  YButton,
  YTextInput,
  YProduct,
  YLoader,
  YIconButton,
  YOptionGroup,
} from "../../components";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "../../styles";
import { connect } from "react-redux";
import { ROUTES, formatQuantity } from "../../utils";
import moment from "moment/min/moment-with-locales";

moment.locale("fr");

function ConsumptionFormScreen(props) {
  // Si vrai, signifie que le formulaire sert a modifier la consommation
  const isModifying = props.navigation.getParam("isModifying");

  const product = props.navigation.getParam("product");

  const [quantity, setQuantity] = useState("100");

  // Unite
  const UNITS = ["g", "ml"];
  const [unit, setUnit] = useState("g");

  // Si quantite du produit disponible alors proposer des pourcentages
  if (product.product_quantity > 0) UNITS.push("%");

  // date
  const today = new Date();
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  /** Fonction gerant la soumission du formulaire */
  function handleSubmit() {
    if (isModifying) modifyConsumption();
    else addToConsumption();
  }

  /**
   * Fonction faisiant une requete pour ajouter le produit en question
   * a la consommation de l'utilisateur avec les donnees saisies
   */
  function addToConsumption() {
    setLoading(true);

    // Produit consomme qui sera transmis au serveur
    const consumedProduct = {
      product: {
        name: product.name,
        calories: product.calories,
        image_url: product.image_url,
        quantity: product.quantity,
        product_quantity: product.product_quantity,
        nutriscore: product.nutriscore,
      },
      unit,
      quantity: formatQuantity(quantity),
      date,
    };

    // Requete pour ajouter le produit a sa consommation
    fetch(ROUTES.CONSUMPTION(props.email), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(consumedProduct),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);

        // En cas de succes, retourner a la page precedente
        if (res.ok) {
          Alert.alert(
            "Bon appetit !",
            product.name + " a bien ete ajoute a votre consommation",
          );

          props.navigation.goBack();
        }

        // Sinon, emettre une erreur
        else throw new Error("Add to consumption failed");
      })
      .catch((err) => {
        setLoading(false);

        Alert.alert("Aie !", "Je me suis mordu la langue 🤪 " + err);
      });
  }

  function modifyConsumption() {
    setLoading(true);

    // Requete pour ajouter le produit a sa consommation
    fetch(ROUTES.CONSUMPTION(props.email), {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + props.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: product._id,
        quantity: formatQuantity(quantity),
        unit,
        date,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);

        // En cas de succes, retourner a la page precedente
        if (res.ok) {
          Alert.alert("✔ C'est fait !", product.name + " a bien ete modifie");

          props.navigation.goBack();
        }

        // Sinon, emettre une erreur
        else throw new Error("Modify consumption failed");
      })
      .catch((err) => {
        setLoading(false);

        Alert.alert("Aie !", "Je me suis mordu la langue 🤪 " + err);
      });
  }

  function deleteFromConsumption() {
    setLoading(true);

    // Requete pour ajouter le produit a sa consommation
    fetch(ROUTES.CONSUMPTION(props.email), {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + props.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: product._id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);

        // En cas de succes, retourner a la page precedente
        if (res.ok) {
          Alert.alert("✔ C'est fait !", product.name + " a bien ete supprime");

          props.navigation.goBack();
        }

        // Sinon, emettre une erreur
        else throw new Error("Delete from consumption failed");
      })
      .catch((err) => {
        setLoading(false);

        Alert.alert("Aie !", "Je me suis mordu la langue 🤪 " + err);
      });
  }

  return (
    <YContainer>
      <ScrollView style={CSS.container}>
        <View style={{ padding: 16 }}>
          <View>
            <YProduct {...product} />
          </View>

          <View>
            <View style={CSS.input_group}>
              <Text style={CSS.input_label}>Quantite</Text>
              <YTextInput
                type="number"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>

            <View style={CSS.input_group}>
              <Text style={CSS.input_label}>Unite</Text>
              <YOptionGroup options={UNITS} option={unit} setOption={setUnit} />
            </View>

            <View style={CSS.input_group}>
              <Text style={CSS.input_label}>Date de consommation</Text>
              <DatePickerAndroid date={date} setDate={setDate} />
            </View>

            {
              // Si quantitte non vide et valide
              quantity && Number(formatQuantity(quantity)) ? (
                loading ? (
                  <YLoader />
                ) : (
                  <View style={CSS.actions}>
                    <View style={{ flex: 1, marginRight: 16 }}>
                      <YButton
                        title={isModifying ? "Modifier" : "Consommer"}
                        onPress={handleSubmit}
                      />
                    </View>
                    {isModifying && (
                      <YIconButton
                        name="delete"
                        size={28}
                        color={Colors.red}
                        bgColor={Colors.white}
                        onPress={deleteFromConsumption}
                      />
                    )}
                  </View>
                )
              ) : null
            }
          </View>
        </View>
      </ScrollView>
    </YContainer>
  );
}

function DatePickerAndroid({ date, setDate }) {
  const m_date = moment(date);
  const [show, setShow] = useState(false);

  /**
   * Fonction gerant la selection de date.
   * Elle est execute lors que l'utilisateur selectionne une date avec DateTimePicker
   * @param {Event} event Evenement declanche lors du changement de la date
   * @param {Date} pickedDate Date selectionne, sinon date precedente
   */
  function onDateChange(event, pickedDate = date) {
    // Cacher le calendrier
    setShow(false);

    setDate(pickedDate);
  }

  return (
    <View>
      <TouchableOpacity
        style={CSS.datePicker_pill}
        onPress={() => setShow(true)}
      >
        <Text style={CSS.datePicker_text}>{m_date.format("D MMMM Y")}</Text>

        {show && (
          <DateTimePicker
            value={date}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const CSS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  inner: {
    flex: 1,
  },

  inner__container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  form: {
    marginTop: 8,
  },

  input_group: {
    paddingVertical: 8,
  },

  input_label: {
    marginBottom: 4,
  },

  datePicker_pill: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.light_gray,
    marginVertical: 4,
  },

  datePicker_text: {
    fontSize: 16,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default connect(function (state) {
  return {
    email: state.email,
    token: state.token,
  };
})(ConsumptionFormScreen);
