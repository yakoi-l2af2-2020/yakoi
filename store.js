import { createStore } from "redux";

/* ------------------------------- Constantes ------------------------------- */
const CHANGER_INFORMATIONS = "CHANGER_INFORMATIONS";
const REINITIALISER_INFORMATIONS = "REINITIALISER_INFORMATIONS";

const INITIAL_STATE = {};

/* --------------------------------- Reducer -------------------------------- */
function userInfo(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REINITIALISER_INFORMATIONS:
      return INITIAL_STATE;

    case CHANGER_INFORMATIONS:
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

/* --------------------------------- Actions -------------------------------- */
export function changer_infos(informations){
   return {
     type: CHANGER_INFORMATIONS,
     payload: informations
   }
}

export function reinitialiser(informations){
   return {
     type: REINITIALISER_INFORMATIONS,
   }
}

/* ---------------------------------- Store --------------------------------- */
const store = createStore(userInfo);

export default store;