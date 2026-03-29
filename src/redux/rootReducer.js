import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/redux/auth/authSlice";
import cartReducer from "@/redux/cart/cartSlice";
import artsReducer from "@/lib/slices/artsSlice";
import userPreferencesReducer from "@/redux/userPreferences/userPreferenceSlice";
import musicReducer from "@/redux/music/musicSlice";
import videoReducer from "@/redux/video/videoSlice";
import eventReducer from "@/redux/events/eventSlice";
import artReducer from "@/redux/art/artSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  arts: artsReducer,
  userPreferences: userPreferencesReducer,
  music: musicReducer,
  video: videoReducer,
  events: eventReducer,
  art: artReducer,
});

export default rootReducer;