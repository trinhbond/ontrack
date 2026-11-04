import { Input, InputProps, styled } from "@mui/material"
import { alpha } from "@mui/material/styles"

const StyledPhotoInput = styled(Input)(({ theme }) => ({
  width: "100%",
  minHeight: theme.spacing(5.5),
  padding: theme.spacing(0.75, 1),
  border: `1px solid ${alpha(theme.palette.text.primary, 0.14)}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.white, 0.72),
  "&::before, &::after": {
    display: "none",
  },
  "&:hover:not(.Mui-disabled)::before": {
    border: 0,
  },
  "& input": {
    cursor: "pointer",
  },
  "& input::file-selector-button": {
    marginRight: theme.spacing(1.5),
    padding: theme.spacing(0.75, 1.25),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    color: theme.palette.text.primary,
    font: "inherit",
    fontWeight: 700,
    cursor: "pointer",
  },
}))

export default function PhotoInput(props: InputProps) {
  return (
    <StyledPhotoInput
      type="file"
      inputProps={{ accept: "image/*", ...props.inputProps }}
      {...props}
    />
  )
}
