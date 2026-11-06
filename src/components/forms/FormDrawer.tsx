import {
  Box,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { alpha } from "@mui/material/styles";

type FormDrawerProps = {
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  onClose: () => void;
  open: boolean;
  title: string;
};

export default function FormDrawer({
  children,
  description,
  eyebrow,
  onClose,
  open,
  title,
}: FormDrawerProps) {
  const theme = useTheme();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: (theme) => ({
            width: { xs: "100%", sm: theme.spacing(58) },
            maxWidth: "100%",
            backgroundImage: "none",
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.primary.dark
                : theme.palette.primary.light,
            borderLeft: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
          }),
        },
      }}
    >
      <Box
        sx={(theme) => ({
          position: "sticky",
          top: 0,
          zIndex: 1,
          px: { xs: 2.5, sm: 4 },
          pt: { xs: 2.5, sm: 4 },
          pb: 2.5,
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.primary.dark, 0.94)
              : alpha(theme.palette.primary.light, 0.94),
          borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
          backdropFilter: "blur(14px)",
        })}
      >
        <Stack direction="row" justifyContent="space-between" gap={2}>
          <Box>
            <Typography
              color="primary.main"
              fontSize="0.65rem"
              fontWeight={700}
              letterSpacing="0.14em"
              textTransform="uppercase"
            >
              {eyebrow}
            </Typography>
            <Typography variant="h2" mt={0.75}>
              {title}
            </Typography>
            <Typography color="text.secondary" mt={1} fontSize="0.8rem">
              {description}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            aria-label="Close form"
            sx={{ alignSelf: "flex-start" }}
          >
            <CloseRoundedIcon
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.dark,
              }}
            />
          </IconButton>
        </Stack>
      </Box>
      <Box sx={{ p: { xs: 2.5, sm: 4 } }}>{children}</Box>
    </Drawer>
  );
}
