import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Controller, useForm } from "react-hook-form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../../../config/firebase";
import { FirebaseError } from "firebase/app";
import { toast } from "react-toastify";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  Typography,
  useTheme,
} from "@mui/material";
import { FormContainer } from "../../FormContainer";
import { BaseButton, TextButton } from "../../buttons";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  photo?: FileList;
};

export default function SignupForm({
  handleToggle,
  showPassword,
  setShowPassword,
}: {
  handleToggle: () => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const theme = useTheme();

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
      case "auth/email-already-in-use":
        setError("email", {
          type: "custom",
          message: "This email is already in use",
        });
        break;
      default:
        console.error("An unexpected Firebase error occurred:", error.message);
    }
  };

  const handleSignup = handleSubmit(async (data) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const image = data.photo?.[0];
      let photoURL: string | undefined;

      if (image) {
        try {
          const uploadedImage = await uploadBytes(
            ref(storage, `profile-images/${user.uid}`),
            image,
            { contentType: image.type },
          );
          photoURL = await getDownloadURL(uploadedImage.ref);
        } catch (error) {
          console.error("Unable to upload the profile image:", error);
          toast.error(
            "Your account was created, but the profile image could not be uploaded.",
          );
        }
      }

      await updateProfile(user, {
        displayName: data.name,
        ...(photoURL ? { photoURL } : {}),
      });
      reset();
      window.location.href = "/applications";
    } catch (error) {
      if (error instanceof FirebaseError) {
        getError(error);
      } else {
        console.error("Unable to create the account:", error);
        setError("root.server", {
          type: "custom",
          message: "Unable to create your account. Please try again.",
        });
      }
    }
  });

  return (
    <FormContainer width="100%" className="signup-form" onSubmit={handleSignup}>
      <Box display="flex" flexDirection="column" gap={0.5}>
        <FormControl>
          <Box component="label" mb={0.5}>
            Name
          </Box>
          <Controller
            control={control}
            name={"name"}
            render={() => (
              <Input
                sx={{
                  color: theme.palette.secondary.main,
                  background: theme.palette.primary.main,
                }}
                error={!!errors.name}
                placeholder="Name"
                {...register("name", {
                  pattern: {
                    value: /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/,
                    message: "Name cannot have symbols or special characters",
                  },
                  required: {
                    value: true,
                    message: "Name is required",
                  },
                })}
              />
            )}
          />
          {errors.name && (
            <Typography component="p" role="alert">
              {errors.name.message}
            </Typography>
          )}
        </FormControl>
      </Box>
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
                sx={{
                  color: theme.palette.secondary.main,
                  background: theme.palette.primary.main,
                }}
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
                sx={{
                  color: theme.palette.secondary.main,
                  background: theme.palette.primary.main,
                }}
                error={!!errors.password}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
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
                  validate: (value) => {
                    return !!value.trim();
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
      <FormControl>
        <Box component="label" htmlFor="signup-photo" mb={0.5}>
          Profile image (optional)
        </Box>
        <Input
          id="signup-photo"
          type="file"
          error={!!errors.photo}
          inputProps={{ accept: "image/*" }}
          {...register("photo", {
            validate: (files) => {
              const image = files?.[0];
              if (!image) return true;
              if (!image.type.startsWith("image/"))
                return "Please choose an image file";
              if (image.size > 5 * 1024 * 1024)
                return "Image must be 5 MB or smaller";
              return true;
            },
          })}
        />
        {errors.photo && (
          <Typography component="p" role="alert">
            {errors.photo.message}
          </Typography>
        )}
      </FormControl>
      {errors.root?.server && (
        <Typography component="p" role="alert">
          {errors.root.server.message}
        </Typography>
      )}
      <BaseButton
        type="submit"
        disabled={isSubmitting}
        sx={{
          fontWeight: 600,
          fontSize: 18,
          padding: "12px 32px",
          alignSelf: "center",
        }}
      >
        Create an account
      </BaseButton>
      <Box alignSelf="center">
        Already have an account?{" "}
        <TextButton sx={{ color: "#0000EE" }} onClick={handleToggle}>
          Sign in
        </TextButton>
      </Box>
    </FormContainer>
  );
}
