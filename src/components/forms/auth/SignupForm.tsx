import { IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../config/firebase";
import { getAuthErrorMessage } from "../../../lib/auth";
import {} from "../../../lib/profilePhoto";
import { toastMessage } from "../../../utils";
import { FormContainer } from "../../FormContainer";
import { TextInput } from "../../TextInput";
import { BaseButton, TextButton } from "../../buttons";
import FormField from "../FormField";
import PhotoInput from "../PhotoInput";

type SignupValues = {
  name: string;
  email: string;
  password: string;
  photo?: FileList;
};

type SignupFormProps = {
  handleToggle: () => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SignupForm({
  handleToggle,
  showPassword,
  setShowPassword,
}: SignupFormProps) {
  const navigate = useNavigate();
  const toastId = useRef("toast");
  const {
    control,
    handleSubmit,
    register,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleSignup = handleSubmit(async (data) => {
    try {
      const credentials = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      await updateProfile(credentials.user, {
        displayName: data.name,
      });
      reset();
      navigate("/applications");
    } catch (error) {
      setError("email", {
        type: "custom",
        message: getAuthErrorMessage(error),
      });
    }
  });

  return (
    <FormContainer width="100%" className="signup-form" onSubmit={handleSignup}>
      <FormField label="Your name" error={errors.name?.message}>
        <TextInput
          placeholder="Alex Morgan"
          autoComplete="name"
          error={Boolean(errors.name)}
          {...register("name", {
            required: "Name is required",
            pattern: {
              value: /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/,
              message: "Use letters, numbers, and spaces only",
            },
          })}
        />
      </FormField>

      <FormField label="Email address" error={errors.email?.message}>
        <TextInput
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={Boolean(errors.email)}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Enter a valid email address",
            },
          })}
        />
      </FormField>

      <FormField label="Password" error={errors.password?.message}>
        <TextInput
          type={showPassword ? "text" : "password"}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          error={Boolean(errors.password)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                edge="end"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((isVisible) => !isVisible)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
            validate: (value) =>
              Boolean(value.trim()) || "Password is required",
          })}
        />
      </FormField>

      {/* <FormField label="Profile photo" error={errors.photo?.message} optional>
        <Controller
          control={control}
          name="photo"
          rules={{
            validate: (files) => {
              const image = files?.[0];
              return image ? validateProfilePhoto(image) || true : true;
            },
          }}
          render={({ field: { onChange, ref } }) => (
            <PhotoInput
              inputRef={ref}
              error={Boolean(errors.photo)}
              onChange={(event) =>
                onChange((event.target as HTMLInputElement).files)
              }
            />
          )}
        />
      </FormField> */}

      <BaseButton type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </BaseButton>

      <Stack direction="row" justifyContent="center" alignItems="center">
        <Typography color="text.secondary" fontSize="0.8rem">
          Already have an account?
        </Typography>
        <TextButton type="button" onClick={handleToggle}>
          Sign in
        </TextButton>
      </Stack>
    </FormContainer>
  );
}
