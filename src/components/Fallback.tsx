import Box from "@mui/material/Box";
import { Loading } from "./Loading";
import { useTheme } from "@mui/material";

export const Fallback = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bottom: 0,
        left: 0,
        position: "fixed",
        placeContent: "center",
        right: 0,
        textAlign: "center",
        top: 0,
      }}
    >
      <Loading theme={theme.palette.mode} />
    </Box>
  );
};
