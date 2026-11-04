import { Avatar as MuiAvatar, AvatarProps, styled } from "@mui/material";
import { alpha } from "@mui/material/styles";

const StyledAvatar = styled(MuiAvatar)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.getContrastText(theme.palette.primary.main),
  cursor: "pointer",
  height: theme.spacing(4.5),
  width: theme.spacing(4.5),
  border: `2px solid ${alpha(theme.palette.background.paper, 0.85)}`,
  fontSize: theme.typography.pxToRem(12),
  fontWeight: 700,
  boxShadow: `0 0 0 1px ${alpha(theme.palette.text.primary, 0.08)}`,
}));

export const Avatar: React.FC<AvatarProps> = (props) => (
  <StyledAvatar {...props} />
);
