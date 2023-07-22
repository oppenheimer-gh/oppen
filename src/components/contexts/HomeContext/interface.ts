import { Dispatch, ReactNode, SetStateAction } from "react";
import { User } from "../AuthContext/interface";

export interface HomeContextInterface {
  dataisReady: boolean;
  pinpointType: "src" | "dest" | "done" | "";
  setPinpointType: Dispatch<SetStateAction<"src" | "dest" | "done" | "">>;
  openSheet: boolean;
  setOpenSheet: Dispatch<SetStateAction<boolean>>;
  posts: Post[] | null;
  getPosts: any;
  openPostSheet: boolean;
  setOpenPostSheet: Dispatch<SetStateAction<boolean>>;
  post: Post | null;
  setPost: Dispatch<SetStateAction<Post | null>>;
}

export interface HomeContextProviderProps {
  children: ReactNode;
}

export interface Post {
  id: string;
  comments_count: number;
  created_at: string;
  destination_longitude: string;
  destination_latitude: string;
  source_longitude: string;
  source_latitude: string;
  distance_in_km: number;
  message: string;
  user: User;
}
