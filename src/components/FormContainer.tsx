import Box, { BoxProps } from "@mui/material/Box";
import React from "react";

interface FormContainerProps extends BoxProps {
  children: React.ReactNode;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  ...props
}) => {
  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      gap={2.5}
      {...props}
    >
      {children}
    </Box>
  );
};
