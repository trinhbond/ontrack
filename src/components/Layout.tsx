import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from "./Header";
import { AuthContext } from "../context/AuthContext";
import { GlobalStyles } from "@mui/material";

export default function Layout() {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" replace />;

  return (
    <>
      <Header />
      <Outlet />
      <GlobalStyles
        styles={(theme) => ({
          body: {
            background:
              theme.palette.mode === "dark"
                ? theme.palette.primary.dark
                : theme.palette.primary.light,
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
          },
        })}
      />
    </>
  );
}
