/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
const LOCALHOST = "http://192.168.1.105:8787"; // adresse du serveur local
const REMOTE = "https://yakoi-backend.herokuapp.com"; // adresse du serveur
const ROOT = REMOTE; // adresse du serveur utilise

/**
 * Objet regroupant les differentes routes pour effectuer des requetes.
 * Pour les routes de l'API, il faut preciser l'adresse email de l'utilisateur
 * @param {string} email Email de l'utilisateur en question
 */
export const ROUTES = {
  // Authentification
  LOGIN: ROOT + "/authentication/login",
  SIGN_UP: ROOT + "/authentication/signup",
  PASSWORD: ROOT + "/authentication/password",

  // API
  INFORMATIONS: (email) => ROOT + `/api/users/${email}/informations`,
  HISTORY: (email) => ROOT + `/api/users/${email}/history`,
  FAVORITES: (email) => ROOT + `/api/users/${email}/favorites`,
  CONSUMPTION: (email) => ROOT + `/api/users/${email}/consumption`,
};

/* -------------------------------------------------------------------------- */
/*                            PRODUITS ALIMENTAIRES                           */
/* -------------------------------------------------------------------------- */

/**
 * Fonction pour recuperer les informations d'un produit
 * a l'aide de son code-barres depuis la base de donnees Open Food Facts
 * @param {string} barcode Code-barres d'un produit
 * @returns {object|null} Donnnees brutes d'un produit. Renvoi NULL si aucun produit trouve
 */
export async function getProduct(barcode) {
  const OPENFOODFACTS_API_URL =
    "https://world.openfoodfacts.org/api/v0/product/" + barcode + ".json";

  const response = await fetch(OPENFOODFACTS_API_URL).then((res) => res.json());

  // Si aucun produit trouve
  if (!response.status) return null;

  return response;
}

/**
 * Fonction renvoyant des donnees filtres d'un produit a partir de ses donnees brutes
 * @param {object} product_data Donnees d'un produit
 * @returns {object} Donnees formates d'un produit (nom, marque, miniature,)
 */
export function formatProductData(product_data) {
  const { product } = product_data;
  const { nutriments } = product;

  // Choix des ingredients selon la disponibilite du francais
  let ingredients = product.ingredients_text_fr || product.ingredients_text;

  // Formatage des ingredients initialement en Markdown [_, *]
  ingredients = ingredients
    ? ingredients
        .split("")
        .map((char) => (char === "_" || char === "*" ? "" : char))
        .join("")
    : "";

  // informations pricipales
  const description = {
    code: product_data.code, // code-barres
    name: product.product_name, // nom
    brand: product.brands ? product.brands.split(",")[0] : undefined, // marque
    ingredients,
    image_url: product.image_small_url || product.image_url, // miniature
    nutriscore: product.nutriscore_grade, // nutriscore
    calories: kcal(nutriments.energy) || -1, // calories en kcal
    quantity: product.quantity,
    product_quantity: product.product_quantity,
    favorite: false, // Produit non-favori par defaut
  };

  // Informations relatives a la nutrition
  const nutrition = {
    nutriments: {
      salt: product.nutriments.salt, // sel
      salt_unit_unit: product.nutriments.salt_unit,

      sugars: product.nutriments.sugars, //sucres
      sugars_unit: product.nutriments.sugars_unit, // sucres

      fat: product.nutriments.fat, // lipides
      fat_unit: product.nutriments.fat_unit, // lipides

      saturated_fat: product.nutriments["saturated-fat"], // graisses saturees
      saturated_fat_unit: product.nutriments["saturated-fat_unit"], // graisses saturees

      proteins: product.nutriments.proteins, // proteines
      proteins_unit: product.nutriments.proteins_unit, // proteines

      fiber: product.nutriments.fiber, // fibres
      fiber_unit: product.nutriments.fiber_unit, // fibres

      fruits_vegetables:
        product.nutriments["fruits-vegetables-nuts-estimate_value"], // fruits legumes
    },

    nutrient_levels: product.nutrient_levels,
  };

  // Informatiosn relatives a l'analyse des ingredients (bio, allergenes)
  const analysis = {
    ingredients_tags: product.ingredients_analysis_tags || [], // ingredients (huile de palme, vegetarian, etc)
    labels: product.labels_tags || [], // notamment pour le bio
    nova: product.nova_group, // nova score
    allergens: product.allergens_tags || [], // allergenes
  };

  // Produit regroupant les informatios extraits
  const formatedProduct = {
    ...description,
    ...nutrition,
    ...analysis,
    scan_time: new Date(), // Date de scan
  };

  return formatedProduct;
}

/**
 * Convertit des kilojoules en kilocalories (1kJ = 0.239 kcal)
 * @param {number} kJ Valeur energetique en kilijouless (kJ)
 * @returns {number} Valeur energetique en kilocalories (kcal)
 */
function kcal(kJ) {
  return Math.round(kJ / 4.184);
}

/**
 * Fonction renvoyant le nombre de calories consommes selon la quantite, etc
 * @param {number} quantity - Quantite consomme
 * @param {string} unit - Unite de consommation: g, ml, %
 * @param {number} calories100 - Calories au 100g en kcal
 * @param {number} product_quantity - Quantite de produit tel que vendu. ex: pâtes 500 (g)
 * @returns {number} Nombre de calories consommees
 */
export function getConsumedCalories(
  quantity,
  unit,
  calories100,
  product_quantity,
) {
  switch (unit) {
    case "g":
    case "ml":
      return Math.round((calories100 * quantity) / 100);

    case "%":
      const calories_product_quantity = (calories100 * product_quantity) / 100;
      return Math.round((quantity / 100) * calories_product_quantity);

    default:
      return calories100;
  }
}

/**
 * Fonction remplacant les virgules par des points
 * @param {string} quantity - Quantite en chaine de caracteres
 * @returns {string} Quantite formate dans virgules
 */
export function formatQuantity(quantity) {
  return quantity.replace(",", ".");
}

/**
 * Fonction renvoyant le nombre de calories journalier
 * selon le sexe, taille, poids et age d'un individu
 * @param {string} [gender=m] - Sexe de l'individu
 * @param {number} [height=175] - Taille en cm
 * @param {number} [weight=75] - Poids en kg
 * @param {number} [dob=1990] - Annee de naissance (par defaut: 30 ans)
 * @param {number} [activity=1.2] - Coefficient du niveau d'activite physique
 * @returns {number} Nombre de calories journalier arrondi
 */
export function dailyCalories(
  gender = "m",
  height = 175,
  weight = 75,
  dob = 1990,
  activity = 1.2
) {
  // Age actuel
  const age = new Date().getFullYear() - dob;
  let MB = gender === "f"
    ? 655.1 + 9.56 * weight + 1.85 * height - 4.67 * age // femmes
    : 66.5 + 13.75 * weight + 5 * height - 6.77 * age; // homme

  // Cas extremes
  MB = (MB <= 500 && MB >= 12000) ? 2500 : MB;

  return Math.round(MB * activity) ;
}