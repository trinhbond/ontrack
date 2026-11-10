import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loading } from "./components/Loading";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "./context/ThemeContext";

const Layout = lazy(() => import("./components/Layout"));
const Home = lazy(() => import("./pages/Home"));
const Applications = lazy(() => import("./pages/Applications"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const GetStarted = lazy(() => import("./pages/GetStarted"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/get-started" index element={<GetStarted />} />
                <Route element={<Layout />}>
                  <Route path="applications" element={<Applications />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </Router>
          </AuthProvider>
        </LocalizationProvider>
        <ToastContainer limit={10} />
      </ThemeProvider>
    </Suspense>
  );
}
