import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../models/User.entity";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: localStorage.getItem("access_token")
      ? JSON.parse(atob(localStorage.getItem("access_token")!.split(".")[1]))
          ?.user
      : (null as User | null),
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
