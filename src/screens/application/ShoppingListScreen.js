import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { YTextInput, YIconButton, YEmptyList } from "../../components";
import { Colors } from "../../styles/";
import { MaterialIcons } from "@expo/vector-icons";
import { createStackNavigator } from "react-navigation-stack";

function ShoppingList() {
  const [name, setName] = useState("");

  // Liste de produits
  const [products, setProducts] = useState([]);

  /** 
   * Fonction qui ajoute un produit a la liste de courses
   * */  
  function addProduct() {
    // L'utilisateur ne peut pas ajoute de mot vide a sa liste de courses
    if (name.length === 0) return;

    const newProduct = { name: name, completed: false };
    // cree un nouveau tableau contenant les anciens produits ainsi que le nouveau 
    setProducts([...products, newProduct]);

    // Vide le champ de texte
    setName("");
  }

  /**
   * Fonction qui marque le produit de la liste s'il a ete valide par l'utilisateur
   * @param {number} targetIndex indice du produit complete
   */
  function toggleComplete(targetIndex) {
    setProducts(
      products.map((product, index) => {
        if (index === targetIndex)
          return {
            name: product.name,
            completed: !product.completed,
          };
        else {
          return product;
        }
      })
    );
  }

  /**
   * Fonction qui supprime un element de la liste
   * @param {number} targetIndex indice du produit a supprimer
   */
  function deleteProduct(targetIndex) {
    setProducts(products.filter((product, index) => targetIndex !== index));
  }

  return (
    <KeyboardAvoidingView
      style={CSS.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View>
            <Text style={{ textAlign: "center", margin: 10 }}>
              Composez votre liste de courses et n'oubliez pas de scanner vos
              articles !
            </Text>

            {/* FORMULAIRE */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, marginRight: 8 }}>
                <YTextInput
                  placeholder="nom du produit"
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <YIconButton name="plus" size={28} onPress={addProduct} />
            </View>
            <Text
              style={{ textAlign: "center", margin: 10, color: Colors.red }}
            >
              Attention! votre liste de courses ne peut pas etre sauvegardee
            </Text>
          </View>
          <FlatList
            data={products}
            renderItem={function (element) {
              const product = element.item;
              return (
                <Item
                  name={product.name}
                  completed={product.completed}
                  onPress={() => toggleComplete(element.index)}
                  trash={() => deleteProduct(element.index)}
                />
              );
            }}
            keyExtractor={(element, index) => index.toString()}
            ListEmptyComponent={<YEmptyList />}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

/**
 * composant affichant un produit 
 * @param {string} props.name nom du produit
 * @param {boolean} props.completed affiche si le produit a ete valide ou non
 * @param {Function} props.onPress fonction execute lorsque le produit est appuye
 * @param {Function} props.trash fonction execute lorsque l'utilisateur veut supprimer un produit
 */
function Item({ name, completed, onPress, trash }) {
  return (
    <TouchableOpacity
      style={[CSS.product, completed ? CSS.completed : null]}
      onPress={onPress}
      trash={trash}
    >
      <Text style={CSS.text}>{name}</Text>

      {completed && (
        <MaterialIcons name="check-circle" size={24} color={Colors.green} />
      )}
      <YIconButton name="delete" bgColor={Colors.white} size={23} color={Colors.red} onPress={trash}/>
    </TouchableOpacity>
  );
}

const CSS = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
  },

  product: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.white,

    borderWidth: 1,
    borderColor: Colors.light_gray,
    borderRadius: 12,
  },
  text: {
    flex: 1,
    fontSize: 22,
  },
  completed: {
    borderColor: Colors.green,
    // backgroundColor: Colors.light_green,
  },

  icon: {
    height: 40,
    width: 40,
    backgroundColor: Colors.orange,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
});

const ShoppingListScreen = createStackNavigator({
  ShoppingList: {
    screen: ShoppingList,
    navigationOptions: { title: "Liste de courses" },
  },
});

export default ShoppingListScreen;
