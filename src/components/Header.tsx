import { useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import { Toggle, AntSwitch } from "./Toggle";
import { Box, Button, Typography } from "@mui/material";
import { useMouse } from "../hooks/index";
import { Avatar } from "./Avatar";

export default function Header() {
  const ref = useRef<HTMLDivElement>(null);
  const { user, signOutUser } = useContext(AuthContext);
  const { clicked, handleClick } = useMouse(ref);
  const avatarText = user?.displayName?.[0].toUpperCase();

  if (!user) return null;

  const logOut = () => {
    signOutUser();
    handleClick();
  };

  return (
    <Box position="sticky" top={0} zIndex={10}>
      <Box
        component="header"
        height={"64px"}
        paddingX={3}
        paddingY={2}
        sx={{ background: "#f2f2f3" }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <NavLink to="/">
            <Typography
              variant="h1"
              fontSize={18}
              fontWeight={500}
              sx={{ userSelect: "none" }}
            >
              Ontrack
            </Typography>
          </NavLink>
          <Box position="relative" ref={ref}>
            <Avatar onClick={handleClick} alt={`${user.displayName}`}>
              {avatarText}
            </Avatar>
            {clicked && (
              <Box
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  background: "#fff",
                  minWidth: "225px",
                  position: "fixed",
                  right: "24px",
                  top: "52px",
                  width: "auto",
                  zIndex: 9999,
                  "&>*:not(:last-child)": { borderBottomWidth: 1 },
                }}
              >
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    px={1.5}
                    pt={2}
                  >
                    <Avatar alt={`${user.displayName}`}>{avatarText}</Avatar>
                    <Typography component="span">{user.displayName}</Typography>
                  </Box>
                  <Box mt={1} mb={0.5}>
                    <NavLink to="profile">
                      <Box
                        display="inline-block"
                        width="100%"
                        py={1}
                        px={1.5}
                        sx={{
                          ":hover": {
                            background: "#f5f5f5",
                          },
                        }}
                      >
                        View your profile
                      </Box>
                    </NavLink>
                  </Box>
                </Box>
                <Box>
                  <Box
                    my={0.5}
                    py={1}
                    px={1.5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    Dark mode
                    <Toggle
                      sx={{ m: 0 }}
                      label={false}
                      disabled
                      // checked={false}
                      // onClick={handleThemeChange}
                      // checked={theme === "dark"}
                      control={<AntSwitch />}
                    />
                  </Box>
                </Box>
                <Box>
                  <Button
                    variant="text"
                    onClick={logOut}
                    sx={{
                      borderRadius: 0,
                      textAlign: "start",
                      color: "#000",
                      fontWeight: 400,
                      display: "inline-block",
                      width: "100%",
                      my: 0.5,
                      py: 1,
                      px: 1.5,
                      ":hover": {
                        background: "#f5f5f5",
                      },
                    }}
                  >
                    Sign out
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
