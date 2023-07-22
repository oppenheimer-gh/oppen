import React, { createContext, useContext, useState } from "react";
import { HomeContextInterface, HomeContextProviderProps } from "./interface";

const HomeContext = createContext({} as HomeContextInterface);

export const useHomeContext = () => useContext(HomeContext);

export const HomeContextProvider: React.FC<HomeContextProviderProps> = ({
  children,
}) => {
  const [pinpointType, setPinpointType] = useState<
    "src" | "dest" | "done" | ""
  >("src");
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const value = { pinpointType, setPinpointType, openSheet, setOpenSheet };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};
