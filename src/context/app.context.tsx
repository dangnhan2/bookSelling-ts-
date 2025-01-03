import React, { createContext, useContext, useState } from "react";

interface IAppContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (value: IUser) => void;
  user: IUser | null;
}

const CurrentUserContext = createContext<IAppContext | null>(null);
type IProps = {
  children: React.ReactNode;
};

export const Provider = (props: IProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  return (
    <CurrentUserContext.Provider
      value={{ isAuthenticated, user, setUser, setIsAuthenticated }}
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
