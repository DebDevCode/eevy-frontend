import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: {
    BACKENDURL: "https://eevy-backend-kappa.vercel.app",
  },
};
export const constantsSlice = createSlice({
  name: "constants",
  initialState,
  reducers: {},
});

//   export const {  } = constantsSlice.actions;
export default constantsSlice.reducer;
