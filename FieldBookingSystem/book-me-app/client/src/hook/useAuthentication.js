/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState } from "react";

const authContext = createContext();

export const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};

export const BaseUrl = process.env.REACT_APP_BASE_URL;

const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let headers = new Headers();

  headers.append("Content-Type", "application/json");
  headers.append("Accept", "application/json");
  headers.append("Origin", "*");

  const getUser = () => {
    fetch(`${BaseUrl}user/get_admin`, {
      mode: "cors",
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.user) {
          setUser(json.user);
          setIsLoggedIn(json.user.isLoggedIn);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
        setErrors(null);
      })
      .catch((error) => {
        setErrors(error);
      });
  };

  const signIn = (userName, password) => {
    setIsLoading(true);
    fetch(`${BaseUrl}user/signIn`, {
      mode: "cors",
      method: "PUT",
      headers: headers,
      body: JSON.stringify({ userName: userName, password: password }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.type === 200) {
          setUser(json.user);
          setIsLoggedIn(json.user.isLoggedIn);
          setErrors(null);
        } else {
          setErrors(json);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setErrors(error);
      });
  };

  const signOut = (_id) => {
    setIsLoading(true);
    fetch(`${BaseUrl}user/signOut`, {
      mode: "cors",
      method: "PUT",
      headers: headers,
      body: JSON.stringify({ _id: _id }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.type === 200) {
          setUser(null);
          setIsLoggedIn(json.user.isLoggedIn);
          setErrors(null);
        } else {
          setErrors(json);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setErrors(error);
      });
  };

  return {
    signIn,
    user,
    isLoading,
    isLoggedIn,
    errors,
    signOut,
    getUser,
  };
};
