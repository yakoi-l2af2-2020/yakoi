import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { YProduct, YLoader, YProgressBar, YEmptyList } from "../../components";
import ConsumptionFormScreen from "./ConsumptionFormScreen";
import { Colors, Typography } from "../../styles";
import { withNavigationFocus } from "react-navigation";
import { ROUTES, getConsumedCalories, dailyCalories } from "../../utils";
import { connect } from "react-redux";
import moment from "moment/min/moment-with-locales";
import { MaterialIcons } from "@expo/vector-icons";

// Dates en francais
moment.locale("fr");

// Nombre de calories journalier selon le sexe
let caloriesPerDay = 2500;

function Consumption(props) {
  // Consommation globale
  const [consumption, setConsumption] = useState([]);

  // Consommation par periode
  const [dailyConsumption, setDailyConsumption] = useState([]);
  const [weeklyConsumption, setWeeklyConsumption] = useState([]);
  const [monthlyConsumption, setMonthlyConsumption] = useState([]);

  // Index de l'onglet actif (Jour par defaut)
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabs = ["Jour", "Semaine", "Mois"];

  // Chargement
  const [loading, setLoading] = useState(true);

  // changement du nombre de calories selon le sexe
  caloriesPerDay = dailyCalories(
    props.gender,
    props.height,
    props.weight,
    props.dob,
    props.activity,
  );

  /* A chaque fois qu'on se rends sur cet onglet,
    une requete est effectue pour recuperer toute la consommation
    de l'utilisateur.
    Les donnes recueperes sont sous format de tableau d'objets.
    */
  useEffect(() => {
    if (!props.isFocused) return;
    // Requete
    else
      fetch(ROUTES.CONSUMPTION(props.email), {
        headers: {
          Authorization: "Bearer " + props.token,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          // En cas d'erreur
          if (!res.ok) throw new Error("Error while getting consumption");

          setConsumption(res.consumption);

          // Conversion des dates en objet Moment
          const consumptionData = res.consumption
            .map((consumedProduct) => {
              return {
                ...consumedProduct,
                date: moment(consumedProduct.date),
              };
            })
            // tri par date en ordre decroissant
            .sort((a, b) => b.date - a.date);

          setConsumption(consumptionData);

          /*
          Un produit consomme est de la forme:
            consumedProduct : { _id, product, date, quantity, unit }
          et donc la consommation est de forme Array<cosumedProduct>
        
          Nous allons convertir ce tableau en un format plus adapte pour
          naviguer entre les differentes dates de consommation.
          A la fin, chaque consommation periodique sera de la forme suivante
          ex: dailyConsumption : [
            {
              title: "21/04/2020",
              data: Array<consumedProuduct>
            },
            ...
          ]

          L'acces a la consommation par periode definie se fait donc
          par index. Chaque index est une date differente de consommation
          que l'on peut changer avec le composant DateController
        */

          // Jours uniques
          const uniqueDays = consumptionData
            .map((consumedProduct) =>
              consumedProduct.date.format("dddd DD/MM/YYYY"),
            )
            .filter(
              (date, index, dateArray) => dateArray.indexOf(date) === index,
            );

          // Consommation par jour
          setDailyConsumption(
            uniqueDays.map((day) => {
              return {
                title: day,
                products: consumptionData.filter(
                  ({ date }) => date.format("dddd DD/MM/YYYY") === day,
                ),
              };
            }),
          );

          // Semaines uniques
          const uniqueWeeks = consumptionData
            .map((consumedProduct) =>
              moment(consumedProduct.date) // clone de la date car objet Moment mutable !
                .startOf("week")
                .format("dddd DD/MM/YYYY"),
            )
            .filter(
              (date, index, dateArray) => dateArray.indexOf(date) === index,
            );

          // Consommation par semaine
          setWeeklyConsumption(
            uniqueWeeks.map((week) => {
              return {
                title: week,
                products: consumptionData.filter(
                  ({ date }) =>
                    date.startOf("week").format("dddd DD/MM/YYYY") === week,
                ),
              };
            }),
          );

          // Mois uniques
          const uniqueMonths = consumptionData
            .map((consumedProduct) => consumedProduct.date.format("MMMM YYYY"))
            .filter(
              (date, index, dateArray) => dateArray.indexOf(date) === index,
            );

          // Consommation par mois
          setMonthlyConsumption(
            uniqueMonths.map((month) => {
              return {
                title: month,
                products: consumptionData.filter(
                  ({ date }) => date.format("MMMM YYYY") === month,
                ),
              };
            }),
          );

          setLoading(false);
        })
        // En cas d'erreur
        .catch((err) => {
          console.log(err);

          setLoading(false);
        });
  }, [props.isFocused]);

  function goToModifyConsumption(_id, consumedProduct) {
    props.navigation.navigate("ModifyConsumption", {
      product: { _id, ...consumedProduct },
      isModifying: true,
    });
  }

  if (loading) {
    return (
      <View style={CSS.loading__container}>
        <YLoader />
        <Text style={[Typography.center, Typography.muted]}>
          Recuperation de la consommation en cours...
        </Text>
      </View>
    );
  } else {
    return (
      <View style={CSS.container}>
        <View style={CSS.container}>
          <TabBar
            tabs={tabs}
            activeTabIndex={activeTabIndex}
            setActiveTabIndex={(index) => setActiveTabIndex(index)}
          />

          {activeTabIndex === 0 && (
            <TabContent
              data={dailyConsumption}
              max={caloriesPerDay * 1}
              goToModifyConsumption={goToModifyConsumption}
            />
          )}

          {activeTabIndex === 1 && (
            <TabContent
              data={weeklyConsumption}
              max={caloriesPerDay * 7}
              label="Semaine du "
              goToModifyConsumption={goToModifyConsumption}
            />
          )}
          {activeTabIndex === 2 && (
            <TabContent
              data={monthlyConsumption}
              max={caloriesPerDay * 30}
              goToModifyConsumption={goToModifyConsumption}
            />
          )}
        </View>
      </View>
    );
  }
}

/** En-tete contentant les onglets */
function TabBar({ tabs, activeTabIndex, setActiveTabIndex }) {
  const styles = StyleSheet.create({
    tabBar: {
      flexDirection: "row",
      backgroundColor: Colors.white,
    },
  });

  return (
    <View style={styles.tabBar}>
      {/* TABS */}
      {tabs.length > 0 &&
        tabs.map((title, tabIndex) => {
          return (
            <Tab
              title={title}
              active={tabIndex === activeTabIndex}
              onPress={() => setActiveTabIndex(tabIndex)}
              key={tabIndex.toString()}
            />
          );
        })}
    </View>
  );
}

/** Composant pour un onglet */
function Tab({ title, active, onPress }) {
  const styles = StyleSheet.create({
    tab: {
      flex: 1,
      alignItems: "center",
      backgroundColor: active ? Colors.orange : Colors.white,

      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
    },
    tab_text: {
      paddingVertical: 12,
      color: active ? Colors.white : Colors.gray,
      fontWeight: active ? "bold" : "normal",
    },
  });

  return (
    <TouchableOpacity style={styles.tab} onPress={onPress}>
      <Text style={styles.tab_text}>{title}</Text>
    </TouchableOpacity>
  );
}

function TabContent({ data, label, max, goToModifyConsumption }) {
  if (data.length === 0) return <YEmptyList />;

  const [dateIndex, setDateIndex] = useState(0);

  // Donnes de consommation
  let consumptionData;
  let calories;

  // Mise a jour des donnes de consommation
  try {
    consumptionData = data[dateIndex].products;
    calories = consumptionData.reduce((acc, consumedProduct) => {
      const { quantity, unit, product } = consumedProduct;

      return (
        acc +
        getConsumedCalories(
          quantity,
          unit,
          product.calories,
          product.product_quantity,
        )
      );
    }, 0);
  } catch (err) {
    // En cas d'erreur
    // Lorsque le dernier produit d'une date est supprime
    consumptionData = [];
    calories = 0;
  }

  const styles = StyleSheet.create({
    average_calories_container: {
      padding: 16,
    },

    average_calories: {
      marginVertical: 8,
      textAlign: "center",
    },

    YProduct_wrapper: {
      paddingHorizontal: 16,
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <DateController
        dates={data.map((el) => el.title)} // recuperation des date uniquement
        dateIndex={dateIndex}
        setDateIndex={setDateIndex}
        label={label}
      />

      <View style={styles.average_calories_container}>
        <YProgressBar value={calories} max={max} />

        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <Text style={styles.average_calories}>
            {calories} / {max} kcal ({Math.round((100 * calories) / max)}%)
          </Text>
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={() => {
              Alert.alert(
                "Calories journalier",
                [
                  "\nLe nombre de calories journalier est calcule a partir de la Formule de Harris et Benedict.\n",
                  "Elle prend en compte votre age, taille, poids et activite physique hebdomadaire."
                ].join("\n"),
              );
            }}
          >
            <MaterialIcons name="info-outline" size={28} color={Colors.gray} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={consumptionData}
        renderItem={(e) => {
          const { _id, product, quantity, unit } = e.item;
          const calories = getConsumedCalories(
            quantity,
            unit,
            product.calories,
            product.product_quantity,
          );

          return (
            <View style={styles.YProduct_wrapper}>
              <YProduct
                {...product}
                quantity={quantity + " " + unit}
                calories={calories}
                onPress={() => goToModifyConsumption(_id, product)}
              />
            </View>
          );
        }}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<YEmptyList />}
      />
    </View>
  );
}

/**
 * Composant permettant de naviguer entre un tableau de dates.
 * @param {Array<string>} dates - Tableau de dates
 * @param {number} dateIndex - Index de la date initiale
 * @param {Function} setDateIndex - Fonction permettant de modifier l'index de la date
 * @param {string} label - Preffixe  a la date (ex: Semaine du <date>)
 */
function DateController({ dates, dateIndex = 0, setDateIndex, label = "" }) {
  const previousDisabled = dateIndex === dates.length - 1;
  const nextDisabled = dateIndex === 0;

  // Si une la date a ete modifie
  // alors mettre l'index de la data a la plus recente
  useEffect(() => {
    setDateIndex(0);
  }, [dates.length]);

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: Colors.orange,
    },

    date: {
      flex: 1,
      paddingVertical: 16,
      alignItems: "center",
    },

    date_text: {
      color: Colors.white,
      fontWeight: "bold",
    },

    icon__button: {
      justifyContent: "center",
      paddingHorizontal: 16,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.icon__button}
        disabled={previousDisabled}
        // date suivante
        onPress={() => setDateIndex(dateIndex + 1)}
      >
        <MaterialIcons
          name="keyboard-arrow-left"
          size={28}
          color={!previousDisabled ? Colors.white : "transparent"}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.date}>
        <Text style={styles.date_text}>
          {label}
          {dates[dateIndex]}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.icon__button}
        disabled={nextDisabled}
        // date suivante
        onPress={() => setDateIndex(dateIndex - 1)}
      >
        <MaterialIcons
          name="keyboard-arrow-right"
          size={28}
          color={!nextDisabled ? Colors.white : "transparent"}
        />
      </TouchableOpacity>
    </View>
  );
}

const CSS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  loading__container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});

/* --------------------------------- Export --------------------------------- */

function mapStateToProps(state) {
  return {
    email: state.email,
    token: state.token,
    gender: state.gender,
    height: state.height,
    weight: state.weight,
    dob: state.dob,
    activity: state.activity,
  };
}

const ConsumptionScreen = createStackNavigator({
  Consumption: {
    screen: connect(mapStateToProps)(withNavigationFocus(Consumption)),
    navigationOptions: {
      title: "Consommation",
    },
  },

  ModifyConsumption: {
    screen: ConsumptionFormScreen,
    navigationOptions: { title: "Modifier" },
  },
});

export default ConsumptionScreen;
