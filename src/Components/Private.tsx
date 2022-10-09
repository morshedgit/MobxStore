import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../Models/User";

export const Private = (props: { children: ReactNode; user?: User }) => {
  const navigate = useNavigate();
  if (!props.user) {
    navigate("/login");
    return <h1>You should login</h1>;
  }
  return <>{props.children}</>;
};
