import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { routes } from "../routes";

export const useSession = () => {
  const navigate = useNavigate();

  const sessionKey_ = localStorage.getItem("sessionKey");

  useEffect(() => {
    if (sessionKey_) {
      navigate(routes.main);
    }
  }, [navigate, sessionKey_]);

  return (sessionKey_: string) => {
    localStorage.setItem("sessionKey", sessionKey_);
  };
};

export const getSession = () => {
  return localStorage.getItem("sessionKey");
};
