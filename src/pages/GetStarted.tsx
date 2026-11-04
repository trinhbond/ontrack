import { useContext, useState } from "react";
import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Link, Navigate } from "react-router-dom";
import { LoginForm, SignupForm } from "../components/forms/auth";
import { AuthContext } from "../context/AuthContext";

export default function GetStarted() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  function toggleForm() {
    setIsLogin((currentValue) => !currentValue);
    setShowPassword(false);
  }

  if (user) return <Navigate to="/applications" replace />;

  return (
    <Box
      component="main"
      sx={(theme) => ({
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        p: { xs: 2, sm: 4 },
        background: `radial-gradient(circle at 90% 8%, ${alpha(
          theme.palette.info.main,
          0.12,
        )}, transparent 30rem), ${theme.palette.background.default}`,
      })}
    >
      <Paper
        elevation={0}
        sx={(theme) => ({
          width: "100%",
          maxWidth: theme.spacing(57),
          p: { xs: 3, sm: 4.5 },
          border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
          borderRadius: 2.5,
          backgroundColor: alpha(theme.palette.background.paper, 0.78),
          backdropFilter: "blur(18px)",
          boxShadow: `0 ${theme.spacing(3)} ${theme.spacing(10)} ${alpha(
            theme.palette.common.black,
            0.08,
          )}`,
        })}
      >
        <Stack spacing={4}>
          <Box
            component={Link}
            to="/"
            aria-label="Back to Ontrack home"
            sx={(theme) => ({
              width: theme.spacing(15),
              display: "block",
            })}
          >
            <Box
              component="img"
              src={
                theme.palette.mode === "dark"
                  ? "/assets/ontrack_white.png"
                  : "/assets/ontrack.png"
              }
              alt="Ontrack"
              sx={{ width: "100%" }}
            />
          </Box>

          <Box>
            <Typography
              color="primary.main"
              fontSize="0.65rem"
              fontWeight={700}
              letterSpacing="0.14em"
              textTransform="uppercase"
            >
              {isLogin ? "Welcome back" : "Start your search"}
            </Typography>
            <Typography variant="h2" mt={1}>
              {isLogin ? "Sign in to Ontrack" : "Create your account"}
            </Typography>
            <Typography color="text.secondary" mt={1} lineHeight={1.6}>
              {isLogin
                ? "Pick up where you left off and keep every opportunity moving."
                : "Organize applications, interviews, and offers in one calm workspace."}
            </Typography>
          </Box>

          {isLogin ? (
            <LoginForm
              handleToggle={toggleForm}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          ) : (
            <SignupForm
              handleToggle={toggleForm}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
