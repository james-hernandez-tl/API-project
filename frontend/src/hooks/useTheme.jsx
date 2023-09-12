import { useContext, createContext } from "react";

export const themeContext = createContext(null);

export default function useTheme() {
  return useContext(themeContext);
}
