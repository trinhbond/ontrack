import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createMuiTheme } from "./styles/theme";
import { Fallback } from "./components/Fallback";
import { NotFound } from "./pages";

const Layout = lazy(() => import("./components/Layout"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Router>
        <AuthProvider>
          <ThemeProvider theme={createMuiTheme()}>
            <ToastContainer limit={10} />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" index element={<Home />} />
                {/* <Route path="profile" element={<Profile />} /> */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </Suspense>
  );
}
