import { Dispatch, ReactNode, SetStateAction } from "react";

export interface HomeContextInterface {
  pinpointType: "src" | "dest" | "done" | "";
  setPinpointType: Dispatch<SetStateAction<"src" | "dest" | "done" | "">>;
  openSheet: boolean;
  setOpenSheet: Dispatch<SetStateAction<boolean>>;
}

export interface HomeContextProviderProps {
  children: ReactNode;
}
