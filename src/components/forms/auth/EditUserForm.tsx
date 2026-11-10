import { Stack, Typography } from "@mui/material";
import { updateProfile } from "firebase/auth";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AuthContext } from "../../../context/AuthContext";
import {
  uploadProfilePhoto,
  validateProfilePhoto,
} from "../../../lib/profilePhoto";
import { toastMessage } from "../../../utils";
import { Avatar } from "../../Avatar";
import { FormContainer } from "../../FormContainer";
import { TextInput } from "../../TextInput";
import { BaseButton, TextButton } from "../../buttons";
import FormDrawer from "../FormDrawer";
import FormField from "../FormField";
import PhotoInput from "../PhotoInput";

type EditUserFormProps = {
  onClose: () => void;
  open: boolean;
};

export default function EditUserForm({ onClose, open }: EditUserFormProps) {
  const { user } = useContext(AuthContext);
  const toastId = useRef("toast");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string }>({
    defaultValues: {
      name: user?.displayName ?? "",
    },
  });

  useEffect(() => {
    if (open) reset({ name: user?.displayName ?? "" });
  }, [open, reset, user?.displayName]);

  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  if (!user) return null;

  const avatarText = (user.displayName || "Ontrack user")
    .charAt(0)
    .toUpperCase();

  function closeForm() {
    setPhoto(null);
    setPhotoError("");
    onClose();
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;
    const validationError = validateProfilePhoto(file);
    if (validationError) {
      setPhoto(null);
      setPhotoError(validationError);
      return;
    }

    setPhotoError("");
    setPhoto(file);
  }

  const handleUserChange = handleSubmit(async (data) => {
    try {
      let photoURL = user.photoURL;

      if (photo) {
        photoURL = await uploadProfilePhoto(user.uid, photo);
      }

      await updateProfile(user, {
        displayName: data.name,
        photoURL,
      });
      await user.reload();
      toastMessage("Your profile has been updated", "success", toastId);
      closeForm();
    } catch (error) {
      console.error("Unable to upload or update the profile:", error);
      toastMessage("Unable to update your profile", "error", toastId);
    }
  });

  return (
    <FormDrawer
      open={open}
      onClose={closeForm}
      eyebrow="Account"
      title="Edit profile"
      description="Update how you appear across your Ontrack workspace."
    >
      <FormContainer className="edit-user-form" onSubmit={handleUserChange}>
        <FormField label="Profile photo" error={photoError} optional>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={previewUrl ?? user.photoURL ?? undefined}
              alt={user.displayName ?? "Profile photo"}
              sx={(theme) => ({
                width: theme.spacing(8),
                height: theme.spacing(8),
                fontSize: theme.typography.pxToRem(22),
                cursor: "default",
              })}
            >
              {avatarText}
            </Avatar>
            <Stack spacing={0.75} flexGrow={1}>
              <PhotoInput onChange={handlePhotoChange} />
              <Typography color="text.secondary" fontSize="0.7rem">
                JPG, PNG, or WebP. Maximum 5 MB.
              </Typography>
            </Stack>
          </Stack>
        </FormField>

        <FormField label="Display name" error={errors.name?.message}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder="Your name"
                error={Boolean(errors.name)}
              />
            )}
            rules={{
              pattern: {
                value: /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/,
                message: "Use letters, numbers, and spaces only",
              },
              required: "Name is required",
            }}
          />
        </FormField>

        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          justifyContent="flex-end"
          gap={1}
        >
          <TextButton type="button" onClick={closeForm}>
            Cancel
          </TextButton>
          <BaseButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save profile"}
          </BaseButton>
        </Stack>
      </FormContainer>
    </FormDrawer>
  );
}
