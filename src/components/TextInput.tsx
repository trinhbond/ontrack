import { OutlinedInput, OutlinedInputProps, styled } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { forwardRef } from "react";

export const StyledInput = styled(OutlinedInput)(({ theme }) => ({
  minHeight: theme.spacing(5.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.white, 0.72),
  color: theme.palette.text.primary,
  transition: theme.transitions.create([
    "background-color",
    "border-color",
    "box-shadow",
  ]),
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.text.primary, 0.14),
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.text.primary, 0.28),
  },
  "&.Mui-focused": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.common.white, 0.06)
        : theme.palette.background.paper,
    boxShadow: `0 0 0 ${theme.spacing(0.375)} ${alpha(
      theme.palette.primary.main,
      0.12,
    )}`,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
    borderWidth: 1,
  },
  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.error.main,
  },
  "& input::placeholder": {
    color: theme.palette.text.secondary,
    opacity: 0.72,
  },
}));

export const TextInput = forwardRef<HTMLInputElement, OutlinedInputProps>(
  ({ inputRef, ...props }, ref) => (
    <StyledInput fullWidth inputRef={inputRef ?? ref} {...props} />
  ),
);

TextInput.displayName = "TextInput";
