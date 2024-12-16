import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

interface User {
  id: number;
  username: string;
  email: string;
};

interface AuthContextProps {
  setReload: (reload: boolean) => void;
  reload: boolean;
  signed: boolean;
  token: string | null;
  user: User | null;
  create: (formData: FormData) => Promise<any>;
  createMsg: (postId: string, formData: FormData) => Promise<any>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [reload, setReload] = useState<boolean>(false);


  useEffect(() => {
    async function loadStoredToken() {
      const storedToken = await AsyncStorage.getItem("@App:token");
      const storedUser = await AsyncStorage.getItem("@App:user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as User);
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      }
    }
    loadStoredToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    const { token: newToken, user } = response.data;
    console.log(user);

    await AsyncStorage.setItem("@App:token", newToken);
    setToken(newToken);
    await AsyncStorage.setItem("@App:user", JSON.stringify(user));

    setToken(user);
    setUser(user);

    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("@App:token");
    setToken(null);
    delete api.defaults.headers.common["Authorization"];
  };

  const create = async (formData: FormData): Promise<any> => {

      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;

  };

  const createMsg = async (postId: string, formData: FormData): Promise<any> => {

    const response = await api.post(`/messages/${postId}`, formData);

    return response.data;

  };

  return (
    <AuthContext.Provider value={{ signed: !!token, token, signIn, signOut, user, create, reload, setReload, createMsg }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
