import { useState } from "react";
import AppContext from "./AppContext";

export const initialState = {
  user: {},
};

const AppContextProvider = ({ children }) => {
  const [contextState, setContextState] = useState({ ...initialState });

  return (
    <AppContext.Provider value={[contextState, setContextState]}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
