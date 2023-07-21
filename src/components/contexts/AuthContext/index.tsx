import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AuthContextInterface,
  AuthContextProviderProps,
  User,
} from "./interface";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";

const AuthContext = createContext({} as AuthContextInterface);

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const zaxios = async (
    config: AxiosRequestConfig,
    isAuthorized: boolean = false
  ) => {
    return await axios({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      ...config,
      ...(isAuthorized && {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }),
    });
  };

  const register = async (data: any) => {
    try {
      await zaxios({ method: "post", url: "/user/register/", data });
      toast({
        title: "Success!",
        description: "Register successful! Please login to your account.",
      });
      router.push("/login");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          title: "Error",
          description: err?.response?.data.error,
          variant: "destructive",
        });
      }
    }
  };

  const login = async (data: any) => {
    try {
      const {
        data: { token, user },
      } = await zaxios({ method: "post", url: "/user/login/", data });
      localStorage.setItem("token", token);
      setUser(user);
      toast({
        title: "Success!",
        description: "Login successful!",
      });
      router.push("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          title: "Error",
          description: err?.response?.data.error,
          variant: "destructive",
        });
      }
    }
  };

  const logout = async () => {
    try {
      await zaxios({ method: "POST", url: "/user/logout/" }, true);
      setUser(null);
      localStorage.removeItem("token");
      toast({
        title: "Success!",
        description: "Logout successful!",
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          title: "Error",
          description: err?.response?.data.error,
          variant: "destructive",
        });
      }
    }
  };

  const getUser = async () => {
    try {
      const {
        data: { user },
      } = await zaxios({ method: "GET", url: "/user/get/" }, true);
      setUser(user);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          title: "Error",
          description: err?.response?.data.error,
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (router.isReady && !!localStorage.getItem("token")) {
      getUser();
    }
  }, [router]);

  const value = { zaxios, register, login, logout, user, setUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
