import {
  FormHelperText,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

export const fieldControlSx: SxProps<Theme> = (theme) => ({
  minHeight: theme.spacing(5.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.white, 0.72),
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.text.primary, 0.14),
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.text.primary, 0.28),
  },
  "&.Mui-focused": {
    boxShadow: `0 0 0 ${theme.spacing(0.375)} ${alpha(
      theme.palette.primary.main,
      0.12,
    )}`,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: 1,
  },
  "& .MuiSelect-icon": {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.text.secondary
        : theme.palette.primary.dark,
  },
});

type FormFieldProps = {
  children: React.ReactNode;
  error?: string;
  label: string;
  optional?: boolean;
};

export default function FormField({
  children,
  error,
  label,
  optional = false,
}: FormFieldProps) {
  return (
    <Stack spacing={0.75}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="baseline"
      >
        <Typography
          component="label"
          color="text.primary"
          fontSize="0.75rem"
          fontWeight={700}
        >
          {label}
        </Typography>
        {optional && (
          <Typography color="text.secondary" fontSize="0.65rem">
            Optional
          </Typography>
        )}
      </Stack>
      {children}
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Stack>
  );
}
