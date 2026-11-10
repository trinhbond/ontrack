import { CircularProgress, CircularProgressProps } from "@mui/material";

interface LoadingProps extends CircularProgressProps {
  theme?: string | null;
}

export const Spinner: React.FC<LoadingProps> = ({ theme, ...props }) => (
  <CircularProgress color="primary" {...props} />
);
