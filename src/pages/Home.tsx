import { Box, Typography, useTheme } from "@mui/material";
import { BaseButton } from "../components/buttons";
import { Link, Navigate } from "react-router-dom";
import { useWindowDimensions } from "../hooks";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function Home() {
  const { width } = useWindowDimensions();
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/applications" replace />;
  }

  return (
    <Box
      sx={{
        color: "text.primary",
        backgroundColor: "background.default",
        overflowY: "auto",
        height: "100dvh",
      }}
    >
      {width >= 1200 ? (
        <Box
          className="relative"
          height="inherit"
          textAlign="center"
          padding="0px 96px"
          sx={{
            placeContent: "center",
          }}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box width="60%" alignSelf="center">
              <Typography
                component="h1"
                color="text.primary"
                fontSize={56}
                lineHeight={"56px"}
                fontWeight={600}
                marginBottom={3.5}
              >
                Stay organized and in control of your job hunt
              </Typography>
              <Typography
                textAlign="center"
                fontSize={18}
                marginBottom={3.5}
                color="text.secondary"
              >
                Ontrack lets you manage every application in one place.
              </Typography>
              <Link to="/get-started">
                <BaseButton
                  sx={{
                    fontWeight: 600,
                    fontSize: 18,
                    padding: "12px 32px",
                    marginBottom: 3.5,
                  }}
                >
                  Get started
                </BaseButton>
              </Link>
            </Box>
            <Box width={350}>
              <Box
                component="img"
                justifySelf="center"
                src={`/assets/mobile-wireframe.png`}
                alt="Ontrack graphic"
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          className="relative"
          textAlign="center"
          padding="48px 0px 48px 0px"
        >
          <Box
            maxWidth={750}
            margin="auto"
            padding={{ xs: "0px 8px", sm: "8px" }}
          >
            <Typography
              component="h1"
              color="text.primary"
              fontSize={{ xs: "32px", sm: "44px" }}
              lineHeight={{ xs: "32px", sm: "44px" }}
              fontWeight={600}
              marginBottom={3.5}
            >
              Stay organized and in control of your job hunt
            </Typography>
            <Typography
              textAlign="center"
              fontSize={18}
              marginBottom={3.5}
              color="text.secondary"
            >
              Ontrack lets you manage every application in one place.
            </Typography>
            <Link to="/get-started">
              <BaseButton
                sx={{
                  fontWeight: 600,
                  fontSize: 18,
                  padding: "12px 32px",
                  marginBottom: 3.5,
                }}
              >
                Get started
              </BaseButton>
            </Link>
          </Box>
          <Box>
            <Box
              component="img"
              justifySelf="center"
              src={`/assets/mobile-wireframe.png`}
              alt="Ontrack graphic"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
