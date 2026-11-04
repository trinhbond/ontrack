import { alpha, styled } from "@mui/material/styles";
import TextareaAutosize, {
  TextareaAutosizeProps,
} from "@mui/material/TextareaAutosize";
import React from "react";

const StyledTextArea = styled(TextareaAutosize)(({ theme }) => ({
  width: "100%",
  minHeight: theme.spacing(14),
  padding: theme.spacing(1.5),
  resize: "vertical",
  border: `1px solid ${alpha(theme.palette.text.primary, 0.14)}`,
  borderRadius: theme.shape.borderRadius,
  outline: 0,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.white, 0.72),
  color: theme.palette.text.primary,
  font: "inherit",
  transition: theme.transitions.create([
    "background-color",
    "border-color",
    "box-shadow",
  ]),
  "&::placeholder": {
    color: theme.palette.text.secondary,
    opacity: 0.72,
  },
  "&:hover": {
    borderColor: alpha(theme.palette.text.primary, 0.28),
  },
  "&:focus": {
    borderColor: theme.palette.primary.main,
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.common.white, 0.06)
        : theme.palette.background.paper,
    boxShadow: `0 0 0 ${theme.spacing(0.375)} ${alpha(
      theme.palette.primary.main,
      0.12,
    )}`,
  },
}));

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaAutosizeProps
>((props, ref) => <StyledTextArea minRows={4} ref={ref} {...props} />);
