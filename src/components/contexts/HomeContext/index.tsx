import React, { createContext, useContext, useEffect, useState } from "react";
import {
  HomeContextInterface,
  HomeContextProviderProps,
  Post,
} from "./interface";
import { useAuthContext } from "..";
import { useToast } from "@/components/ui/use-toast";

const HomeContext = createContext({} as HomeContextInterface);

export const useHomeContext = () => useContext(HomeContext);

export const HomeContextProvider: React.FC<HomeContextProviderProps> = ({
  children,
}) => {
  const { toast } = useToast();
  const { zaxios } = useAuthContext();
  const [pinpointType, setPinpointType] = useState<
    "src" | "dest" | "done" | ""
  >("src");
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [openPostSheet, setOpenPostSheet] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [dataisReady, setDataIsReady] = useState<boolean>(false);

  const getPosts = async () => {
    try {
      setDataIsReady(false);
      const {
        data: { posts },
      } = await zaxios({ method: "GET", url: "/post/" });
      setPosts(posts);
    } catch (err) {
      toast({
        title: "Error",
        description: "Error while getting posts",
        variant: "destructive",
      });
    } finally {
      setDataIsReady(true);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const value = {
    dataisReady,
    pinpointType,
    setPinpointType,
    openSheet,
    setOpenSheet,
    posts,
    getPosts,
    openPostSheet,
    setOpenPostSheet,
    post,
    setPost,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};
