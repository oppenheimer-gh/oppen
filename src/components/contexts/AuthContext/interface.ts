import { ReactNode } from "react";

export interface AuthContextInterface {
  zaxios: any;
  register: any;
  login: any;
  logout: any;
  user: User | null;
  setUser: any;
}

export interface AuthContextProviderProps {
  children: ReactNode;
}

export interface User {
  id: string;
  username: string;
  email: string;
  is_mentor: boolean;
  profile_photo_url: string;
  has_posted?: boolean;
}
