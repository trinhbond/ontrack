import { Typography, Box, useTheme } from "@mui/material";
import { updateProfile } from "firebase/auth";
import { useContext, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { AuthContext } from "../../../context/AuthContext";
import { ModalContentWrapper } from "../../ModalContentWrapper";
import { FormContainer } from "../../FormContainer";
import { BaseButton, TextButton } from "../../buttons";
import { toastMessage } from "../../../utils";
import { TextInput } from "../../TextInput";

export default function EditUserForm({ onClick }: { onClick: () => void }) {
  const { user } = useContext(AuthContext);
  const toastId = useRef("toast");
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName,
      photoURL: user?.photoURL || " ",
    },
  });
  const { name: username } = getValues();

  if (!user) return null;

  const handleUserChange = handleSubmit(async (data) => {
    updateProfile(user, { displayName: data.name }).then(() => {
      user.reload();
      toastMessage("Your change has been updated", "success", toastId);
    });
  });

  return (
    <ModalContentWrapper
      boxShadow={1}
      width={{ xs: "100%", sm: "384px", md: "384px", lg: "384px" }}
    >
      <Box fontSize={20} fontWeight={500} mb={3}>
        Edit details
      </Box>
      <FormContainer className="edit-user-form" onSubmit={handleUserChange}>
        <Box display="flex" flexDirection="column">
          <Box component="label">Name</Box>
          <Controller
            control={control}
            name={"name"}
            render={() => (
              <TextInput
                error={!!errors.name}
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
                value={username}
                onChange={(e) =>
                  setValue("name", e.target.value, { shouldValidate: true })
                }
              />
            )}
          />
          {errors.name && (
            <Typography component="p" role="alert">
              {errors.name.message}
            </Typography>
          )}
        </Box>
        <Box display="flex" flexDirection="column">
          <Box component="label">Name</Box>
          <Controller
            control={control}
            name={"photoURL"}
            render={() => (
              <input
                type="file"
                onChange={(e) =>
                  setValue("photoURL", e.target.files, { shouldValidate: true })
                }
              />
            )}
          />
          {errors.name && (
            <Typography component="p" role="alert">
              {errors.name.message}
            </Typography>
          )}
        </Box>
        <Box>
          <BaseButton type="submit">Confirm</BaseButton>
          <Box display="inline-block" ml={1} paddingX={1} paddingY={2}>
            <TextButton onClick={onClick}>Cancel</TextButton>
          </Box>
        </Box>
      </FormContainer>
    </ModalContentWrapper>
  );
}
