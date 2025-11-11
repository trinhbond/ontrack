import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as motion from "motion/react-client";
import { Box, Typography } from "@mui/material";
import { LoginForm, SignupForm } from "../components/forms/auth";
import { AuthContext } from "../context/AuthContext";
import { Applications } from ".";

type User = {
  name: string;
  email: string;
  password: string;
};

export default function Home() {
  const [toggle, setToggle] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const { reset } = useForm<User>();

  const handleToggle = () => {
    setToggle(!toggle);
    reset();
  };

  if (user) return <Applications />;

  return (
    <Box
      sx={{
        height: "100dvh",
        overflowY: "auto",
        overflowX: "hidden",
        padding: 3,
      }}
    >
      <Box mb={6}>
        <Typography variant="h1" mb={1} fontSize={36} fontWeight={500}>
          Ontrack
        </Typography>
        <Typography>
          Stay organized and in control of your job hunt — Ontrack lets you
          manage every application in one place.
        </Typography>
      </Box>
      <Box display="flex" justifyItems="center" justifyContent="space-between">
        <Box
          width="100%"
          display="flex"
          justifyItems="center"
          justifyContent="space-between"
          flexDirection={{ xs: "column", sm: "column", md: "row", lg: "row" }}
          gap={{ xs: 6 }}
        >
          <Box
            sx={{
              placeSelf: "center",
              width: { xs: "100%", sm: "100%", md: "400px", lg: "400px" },
            }}
          >
            {toggle ? (
              <LoginForm handleToggle={handleToggle} />
            ) : (
              <SignupForm handleToggle={handleToggle} />
            )}
          </Box>
          <motion.div
            transition={{
              duration: 0.3,
            }}
            initial={{ x: "100%" }}
            animate={{ x: "0" }}
          >
            <Box width={{ xs: "100%", sm: "100%", md: "300px", lg: "300px" }}>
              <Box
                component="img"
                justifySelf="center"
                src={`${process.env.PUBLIC_URL}/assets/mobile-wireframe.png`}
                alt="Ontrack graphic"
              />
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
