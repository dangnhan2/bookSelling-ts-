import { fetchAccount } from "@/services/api";
import React, { createContext, useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

interface IAppContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (value: IUser | null) => void;
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
      const res = await fetchAccount();
      // console.log(res);
      if (res && res.data) {
        setUser(res.data.user);
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
      {isAppLoading === true ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <BeatLoader size={20} />
        </div>
      ) : (
        props.children
      )}
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
