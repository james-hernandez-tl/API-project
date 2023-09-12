import { themeContext } from "../../hooks/useTheme";
import { useState } from "react";

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "Dark");
  localStorage.setItem("theme", "Dark");

  return (
    <themeContext.Provider value={{ setTheme, theme }}>
      <div id={theme}>{children}</div>
    </themeContext.Provider>
  );
}
