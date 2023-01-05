import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: {
    chargerID: null,
    from: '',
    to: '',
  },
};

export const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    updateReservation: (state, action) => {
      const { chargerID, from, to } = action.payload;
      state.value = {
        chargerID,
        from,
        to,
      };
    },
  },
});

export const { updateReservation } = reservationSlice.actions;
export default reservationSlice.reducer;
