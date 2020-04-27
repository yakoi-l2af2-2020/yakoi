import React from "react";

/* ---------------------------- React Navigation ---------------------------- */

import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { enableScreens } from 'react-native-screens';
enableScreens();

/* ---------------------------------- Redux --------------------------------- */

import { Provider } from "react-redux";
import store from "./store";

/* --------------------------------- Assets --------------------------------- */

import { Colors } from "./src/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/* --------------------------------- Screens -------------------------------- */

// Start
import LoadingScreen from "./src/screens/start/LoadingScreen";
import IntroductionScreen from "./src/screens/start/IntroductionScreen";

// Authentication
import LoginScreen from "./src/screens/authentication/LoginScreen";
import SignUpScreen from "./src/screens/authentication/SignUpScreen";
import ForgotPasswordScreen from "./src/screens/authentication/ForgotPasswordScreen";

// Application
import ScanScreen from "./src/screens/application/ScanScreen";
import HistoryScreen from "./src/screens/application/HistoryScreen";
import ConsumptionScreen from "./src/screens/application/ConsumptionScreen";
import ShoppingListScreen from "./src/screens/application/ShoppingListScreen";
import ProfileScreen from "./src/screens/application/ProfileScreen";

// Navigateur du demarrage
const Start = createMaterialBottomTabNavigator(
  {
    Loading: LoadingScreen,
    Introduction: IntroductionScreen,
  },
  {
    initialRouteName: "Loading",
    defaultNavigationOptions: {
      tabBarVisible: false,
    },
  },
);

// Navigateur gerant l'authentification
const Authentication = createMaterialBottomTabNavigator(
  {
    Login: LoginScreen,
    SignUp: SignUpScreen,
    ForgotPassword: ForgotPasswordScreen,
  },
  {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      tabBarVisible: false,
    },
  },
);

// Navigateur de l'application
const Application = createMaterialBottomTabNavigator(
  {
    History: HistoryScreen,
    Consumption: ConsumptionScreen,
    Scan: ScanScreen,
    ShoppingList: ShoppingListScreen,
    Profile: ProfileScreen,
  },
  {
    initialRouteName: "Scan",
    labeled: false,
    activeColor: Colors.orange,
    inactiveColor: Colors.light_gray,
    barStyle: {
      backgroundColor: Colors.white,
    },
    defaultNavigationOptions: (props) => ({
      tabBarIcon: ({ tintColor }) => {
        const ICON_PER_SCREEN = {
          History: "history",
          Consumption: "food-variant",
          Scan: "barcode-scan",
          ShoppingList: "cart",
          Profile: "account",
        };
        const DEFAULT_ICON = "cat";
        const ICON_SIZE = 24;

        const screen = props.navigation.state.routeName;

        return (
          <MaterialCommunityIcons
            name={ICON_PER_SCREEN[screen] || DEFAULT_ICON}
            color={tintColor}
            size={ICON_SIZE}
          />
        );
      },
    }),
  },
);

// Navigateur gerant la navigation entre les differents navigateurs
const Root = createSwitchNavigator(
  {
    Start,
    Authentication,
    Application,
  },
  {
    initialRouteName: "Start",
  },
);

// Composant englobant les navigateur
const Navigation = createAppContainer(Root);

function App(props) {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

export default App;

// Desactiver les messages d'avertissements
console.disableYellowBox = true;