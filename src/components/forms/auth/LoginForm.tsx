import { IconButton, InputAdornment, Stack, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../config/firebase";
import { getAuthErrorMessage } from "../../../lib/auth";
import { FormContainer } from "../../FormContainer";
import { TextInput } from "../../TextInput";
import { BaseButton, TextButton } from "../../buttons";
import FormField from "../FormField";

type LoginValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  handleToggle: () => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginForm({
  handleToggle,
  showPassword,
  setShowPassword,
}: LoginFormProps) {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = handleSubmit(async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
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
    <FormContainer width="100%" className="login-form" onSubmit={handleLogin}>
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
          autoComplete="current-password"
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
          })}
        />
      </FormField>

      <BaseButton type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </BaseButton>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={1.2}
      >
        <Typography color="text.secondary" fontSize="0.8rem">
          New to Ontrack?
        </Typography>
        <TextButton type="button" onClick={handleToggle}>
          Create an account
        </TextButton>
      </Stack>
    </FormContainer>
  );
}
