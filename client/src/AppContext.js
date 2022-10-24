import { createContext } from "react";

export const AppContext = createContext({
  user: null,
  setUser: () => null,
  shop: null,
  setShop: () => null,
  logout: () => null,
  purchase: null,
  setPurchase: () => null,
});
