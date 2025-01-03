import { fetchAccount } from "@/services/api";
import React, { createContext, useContext, useEffect, useState } from "react";

interface IAppContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (value: IUser) => void;
  user: IUser | null;
  isAppLoading: boolean;
  setAppLoading: (value: boolean) => void;
}

const CurrentUserContext = createContext<IAppContext | null>(null);
type IProps = {
  children: React.ReactNode;
};

export const Provider = (props: IProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAppLoading, setAppLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      //   setAppLoading(true);
      const res = await fetchAccount();

      if (res && res.data) {
        setUser(res.data);
        setIsAuthenticated(true);
      }
      setAppLoading(false);
    };
    fetch();
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        setIsAuthenticated,
        isAppLoading,
        setAppLoading,
      }}
    >
      {props.children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentApp = () => {
  const currentUserContext = useContext(CurrentUserContext);

  if (!currentUserContext) {
    throw new Error(
      "useCurrentUser has to be used within <CurrentUserContext.Provider>"
    );
  }

  return currentUserContext;
};
