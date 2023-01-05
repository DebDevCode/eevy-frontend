import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    firstName: null,
    lastName: null,
    email: null,
    tel: null,
    profilPic: null,
    rating: null,
    balance: 50,
    favorites: [],
    recentPlaces: [],
    chargers: [],
    reservationCharger: [],
    allChargersReservations: [{ ongoing: {}, upcoming: [], past: [] }],
    reservations: [],
    allReservations: [{ ongoing: {}, upcoming: [], past: [] }],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.firstName = action.payload.firstName;
      state.value.lastName = action.payload.lastName;
      state.value.email = action.payload.email;
      state.value.tel = action.payload.tel;
      state.value.profilPic = action.payload.profilPic;
      state.value.rating = action.payload.rating;
      state.value.balance = 98.1;
      state.value.favorites = action.payload.favorites;
      state.value.chargers = action.payload.chargers;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.firstName = null;
      state.value.lastName = null;
      state.value.email = null;
      state.value.tel = null;
      state.value.profilPic = null;
      state.value.rating = null;
      state.value.balance = null;
      state.value.favorites = [];
      state.value.recentPlaces = [];
      state.value.chargers = [];
      state.value.reservations = [];
      state.value.allReservations = [{ ongoing: {}, upcoming: [], past: [] }];
    },

    addProfilPic: (state, action) => {
      console.log(action.payload);
      state.value.profilPic = action.payload;
    },

    addBorne: (state, action) => {
      state.value.chargers.push(action.payload);
    },

    editBorneAvailable: (state, action) => {
      for (let charger of state.value.chargers) {
        if (charger._id === action.payload._id) {
          charger.available = !charger.available;
        }
      }
    },

    deleteBorne: (state, action) => {
      state.value.chargers = state.value.chargers.filter(
        (borne) => borne._id !== action.payload._id
      );
      console.log(state.value.chargers);
    },

    addReservation: (state, action) => {
      state.value.reservations = [];
      state.value.reservations.push(action.payload);
    },

    addAllReservation: (state, action) => {
      state.value.allReservations = [{ ongoing: {}, upcoming: [], past: [] }];
      state.value.allReservations[0].ongoing = action.payload.ongoing;
      state.value.allReservations[0].upcoming.push(...action.payload.upcoming);
      state.value.allReservations[0].past.push(...action.payload.past);
    },

    addAllChargersReservations: (state, action) => {
      state.value.allChargersReservations = [
        { ongoing: {}, upcoming: [], past: [] },
      ];
      state.value.allChargersReservations[0].ongoing = action.payload.ongoing;
      state.value.allChargersReservations[0].upcoming.push(
        ...action.payload.upcoming
      );
      state.value.allChargersReservations[0].past.push(...action.payload.past);
    },

    signup: (state, action) => {
      state.value.firstName = action.payload.firstName;
      state.value.lastName = action.payload.lastName;
      state.value.email = action.payload.email;
      state.value.tel = action.payload.tel;
      state.value.password = action.payload.password;
      state.value.iban = action.payload.iban;
      state.value.bicCode = action.payload.bicCode;
      state.value.token = action.payload.token;
    },

    payement: (state, action) => {
      state.value.balance -= action.payload;
    },
  },
});

export const {
  login,
  logout,
  addProfilPic,
  addBorne,
  editBorneAvailable,
  deleteBorne,
  addReservation,
  addAllReservation,
  addAllChargersReservations,
  signup,
  payement,
} = userSlice.actions;
export default userSlice.reducer;
