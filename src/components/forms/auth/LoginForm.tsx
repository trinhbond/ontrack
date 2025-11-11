import { signInWithEmailAndPassword } from "firebase/auth";
import { Controller, useForm } from "react-hook-form";
import { auth } from "../../../config/firebase";
import { FirebaseError } from "firebase/app";
import { Box, FormControl, Input, Typography } from "@mui/material";
import { FormContainer } from "../../FormContainer";
import { BasicButton, TextButton } from "../../buttons";

export default function LoginForm({
  handleToggle,
}: {
  handleToggle: () => void;
}) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const getError = (error: FirebaseError) => {
    switch (error.code) {
      case "auth/invalid-credential":
        setError("email", {
          type: "custom",
          message: "Email or password is invalid",
        });
        break;
      case "auth/invalid-email":
        setError("email", {
          type: "custom",
          message: "Email is invalid",
        });
        break;
      default:
        console.error("An unexpected Firebase error occurred:", error.message);
    }
  };

  const handleLogin = handleSubmit(async (data) => {
    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        //toast notification
        reset();
      })
      .catch((error) => {
        console.log(error.code + ": " + error.message);
        getError(error);
      });
  });

  return (
    <FormContainer className="login-form" onSubmit={handleLogin}>
      <Box display="flex" flexDirection="column" gap={0.5}>
        <FormControl>
          <Box component="label" mb={0.5}>
            Email
          </Box>
          <Controller
            control={control}
            name={"email"}
            render={() => (
              <Input
                error={!!errors.email}
                placeholder="Email"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Email is invalid",
                  },
                })}
              />
            )}
          />
          {errors.email && (
            <Typography component="p" role="alert">
              {errors.email.message}
            </Typography>
          )}
        </FormControl>
      </Box>
      <Box display="flex" flexDirection="column" gap={0.5}>
        <FormControl>
          <Box component="label" mb={0.5}>
            Password
          </Box>
          <Controller
            control={control}
            name={"password"}
            render={() => (
              <Input
                error={!!errors.password}
                type="password"
                placeholder="Password (6 or more characters)"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  minLength: {
                    value: 6,
                    message: "Password must be 6 characters or more",
                  },
                })}
              />
            )}
          />
          {errors.password && (
            <Typography component="p" role="alert">
              {errors.password.message}
            </Typography>
          )}
        </FormControl>
      </Box>
      <BasicButton type="submit" sx={{ alignSelf: "baseline" }}>
        Continue
      </BasicButton>
      <Box>
        Don't have an account?{" "}
        <TextButton sx={{ color: "#0000EE" }} onClick={handleToggle}>
          Sign up
        </TextButton>
      </Box>
    </FormContainer>
  );
}
