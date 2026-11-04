import { CircularProgress, CircularProgressProps } from "@mui/material";

interface LoadingProps extends CircularProgressProps {
  theme?: string | null;
}

export const Loading: React.FC<LoadingProps> = ({ theme, ...props }) => (
  <CircularProgress color="primary" {...props} />
);
