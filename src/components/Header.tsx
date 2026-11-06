import { MouseEvent, useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Avatar } from "./Avatar";
import EditUserForm from "./forms/auth/EditUserForm";

const NAVIGATION_ITEMS = [
  {
    label: "Applications",
    path: "/applications",
    icon: <WorkOutlineRoundedIcon fontSize="small" />,
  },
] as const;

export default function Header() {
  const { user, signOutUser } = useContext(AuthContext);
  const { toggleMode } = useContext(ThemeContext);
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!user) return null;

  const displayName = user.displayName || "Ontrack user";
  const avatarText = displayName.charAt(0).toUpperCase();
  const isMenuOpen = Boolean(menuAnchor);

  function openMenu(event: MouseEvent<HTMLElement>) {
    setMenuAnchor(event.currentTarget);
  }

  function closeMenu() {
    setMenuAnchor(null);
  }

  function openProfile() {
    closeMenu();
    setIsProfileOpen(true);
  }

  async function logOut() {
    closeMenu();
    await signOutUser();
    navigate("/");
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={(theme) => ({
          color: "text.primary",
          backgroundColor: alpha(
            theme.palette.mode === "dark"
              ? theme.palette.primary.dark
              : theme.palette.primary.light,
            0.88,
          ),
          borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
          backdropFilter: "blur(16px)",
        })}
      >
        <Toolbar
          disableGutters
          sx={(theme) => ({
            minHeight: `${theme.spacing(9)} !important`,
            px: { xs: 2, sm: 3, lg: 5 },
          })}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1400,
              mx: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              component={NavLink}
              to="/applications"
              aria-label="Ontrack applications"
              sx={(theme) => ({
                width: { xs: theme.spacing(12), sm: theme.spacing(14) },
                flexShrink: 0,
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

            {/* <Stack
              component="nav"
              aria-label="Primary navigation"
              direction="row"
              spacing={0.5}
              sx={{
                display: { xs: "none", md: "flex" },
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    component={NavLink}
                    to={item.path}
                    startIcon={item.icon}
                    aria-current={isActive ? "page" : undefined}
                    sx={(theme) => ({
                      px: 1.75,
                      py: 1,
                      color: isActive ? "text.primary" : "text.secondary",
                      backgroundColor: isActive
                        ? alpha(theme.palette.text.primary, 0.07)
                        : "transparent",
                      "&:hover": {
                        color: "text.primary",
                        backgroundColor: alpha(
                          theme.palette.text.primary,
                          0.07,
                        ),
                      },
                    })}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack> */}

            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 0.5, sm: 1 }}
            >
              <Button
                id="account-menu-button"
                aria-controls={isMenuOpen ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={isMenuOpen ? "true" : undefined}
                onClick={openMenu}
                sx={(theme) => ({
                  minWidth: 0,
                  p: 0.5,
                  pr: { xs: 0.5, sm: 1 },
                  color: "text.primary",
                  borderRadius: 999,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.text.primary, 0.07),
                  },
                })}
              >
                <Avatar src={user.photoURL ?? undefined} alt={displayName}>
                  {avatarText}
                </Avatar>
                <Box
                  sx={{
                    display: { xs: "none", sm: "block" },
                    ml: 1,
                    maxWidth: 150,
                    textAlign: "left",
                  }}
                >
                  <Typography
                    component="span"
                    display="block"
                    fontSize="0.75rem"
                    fontWeight={700}
                    lineHeight={1.2}
                    noWrap
                  >
                    {displayName}
                  </Typography>
                  <Typography
                    component="span"
                    display="block"
                    color="text.secondary"
                    fontSize="0.65rem"
                    lineHeight={1.2}
                    noWrap
                  >
                    My workspace
                  </Typography>
                </Box>
                <KeyboardArrowDownRoundedIcon
                  fontSize="small"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    ml: 0.5,
                    color: "text.secondary",
                    transform: isMenuOpen ? "rotate(180deg)" : "none",
                    transition: (theme) =>
                      theme.transitions.create("transform"),
                  }}
                />
              </Button>
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        id="account-menu"
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={closeMenu}
        MenuListProps={{ "aria-labelledby": "account-menu-button" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: (theme) => ({
              width: { xs: "calc(100vw - 32px)", sm: theme.spacing(37) },
              maxWidth: theme.spacing(42),
              mt: 1,
              overflow: "visible",
              border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
              borderRadius: 2,
              backgroundImage: "none",
              boxShadow: `0 ${theme.spacing(2)} ${theme.spacing(6)} ${alpha(
                theme.palette.common.black,
                0.14,
              )}`,
            }),
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar src={user.photoURL ?? undefined} alt={displayName}>
              {avatarText}
            </Avatar>
            <Box minWidth={0}>
              <Typography fontWeight={700} noWrap>
                {displayName}
              </Typography>
              <Typography color="text.secondary" fontSize="0.75rem" noWrap>
                {user.email}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {NAVIGATION_ITEMS.map((item) => (
          <MenuItem
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={closeMenu}
            selected={location.pathname === item.path}
            sx={{ display: { md: "none" }, py: 1.25 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            {item.label}
          </MenuItem>
        ))}

        <MenuItem onClick={openProfile} sx={{ py: 1.25 }}>
          <ListItemIcon>
            <PersonOutlineRoundedIcon
              fontSize="small"
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
              }}
            />
          </ListItemIcon>
          Edit profile
        </MenuItem>

        <MenuItem
          component="div"
          disableRipple
          sx={{ py: 0.75, cursor: "default" }}
        >
          <ListItemIcon>
            <DarkModeOutlinedIcon
              fontSize="small"
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
              }}
            />
          </ListItemIcon>
          <Typography flexGrow={1}>Dark mode</Typography>
          <Switch
            edge="end"
            size="small"
            checked={theme.palette.mode === "dark"}
            onChange={toggleMode}
            slotProps={{
              input: {
                "aria-label": "Toggle dark mode",
              },
            }}
          />
        </MenuItem>

        <Divider />

        <MenuItem onClick={logOut} sx={{ py: 1.25, color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main" }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>

      <EditUserForm
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
