import { createContext, useContext, useEffect, useState } from "react";
import UserService from "./features/users/services/users.service";

const AuthContext = createContext(false);
const AuthUpdateContext = createContext((state: boolean) => {});
const UserContext = createContext(() => {});

export function useAuth() {
  return useContext(AuthContext);
}
export function useUpdateAuth() {
  return useContext(AuthUpdateContext);
}

export function useUserAuth() {
  return useContext(UserContext);
}

export function AuthProvider({ children }: any) {
  const [auth, setAuth] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  function toggleAuth() {
    setAuth(!auth);
  }

  function getUserInfo() {
    return userInfo;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuth(true);
      UserService.getMy()
        .then((res: any) => {
          setUserInfo(res);
        })
        .catch((err: any) => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      <AuthUpdateContext.Provider value={toggleAuth}>
        <UserContext.Provider value={getUserInfo}>
          {children}
        </UserContext.Provider>
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  );
}
