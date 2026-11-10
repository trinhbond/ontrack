import { Box, MenuItem, Select, Stack, useTheme } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { addDoc, collection } from "firebase/firestore";
import dayjs, { Dayjs } from "dayjs";
import { useContext, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { db } from "../../../config/firebase";
import { AuthContext } from "../../../context/AuthContext";
import {
  APPLICATION_STATUSES,
  AppForm,
  formatStatus,
} from "../../../lib/applications";
import { toastMessage } from "../../../utils";
import { FormContainer } from "../../FormContainer";
import { TextArea } from "../../TextArea";
import { TextInput } from "../../TextInput";
import { BaseButton, TextButton } from "../../buttons";
import FormDrawer from "../FormDrawer";
import FormField, { fieldControlSx } from "../FormField";

type CreateFormProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DEFAULT_VALUES: Partial<AppForm> = {
  company: "",
  title: "",
  location: "",
  status: "",
  link: "",
  notes: "",
};

export default function CreateForm({
  isModalOpen,
  setIsModalOpen,
}: CreateFormProps) {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const toastId = useRef("toast");
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppForm>({ defaultValues: DEFAULT_VALUES });

  function closeForm() {
    setIsModalOpen(false);
    reset(DEFAULT_VALUES);
    setDate(dayjs());
  }

  const handleAddApplication = handleSubmit(async (data) => {
    if (!user) return;

    try {
      await addDoc(collection(db, "applications", "user/", user.uid), {
        ...data,
        date_applied: date?.toDate() ?? new Date(),
      });
      toastMessage("Your application has been added", "success", toastId);
      closeForm();
    } catch {
      toastMessage("Unable to add your application", "error", toastId);
    }
  });

  return (
    <FormDrawer
      open={isModalOpen}
      onClose={closeForm}
      eyebrow="New opportunity"
      title="Add an application"
      description="Capture the essentials now—you can add more detail whenever you need."
    >
      <FormContainer className="create-form" onSubmit={handleAddApplication}>
        <FormField label="Role" error={errors.title?.message}>
          <TextInput
            placeholder="e.g. Senior Product Designer"
            error={Boolean(errors.title)}
            autoFocus
            {...register("title", {
              required: "Role is required",
              validate: (value) => Boolean(value.trim()) || "Role is required",
            })}
          />
        </FormField>

        <FormField label="Company" error={errors.company?.message}>
          <TextInput
            placeholder="e.g. Linear"
            error={Boolean(errors.company)}
            {...register("company", {
              required: "Company is required",
              validate: (value) =>
                Boolean(value.trim()) || "Company is required",
            })}
          />
        </FormField>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          <FormField label="Location" optional>
            <TextInput placeholder="Remote or city" {...register("location")} />
          </FormField>
          <FormField label="Date applied">
            <DatePicker
              format="DD/MM/YYYY"
              value={date}
              onChange={setDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: fieldControlSx,
                },
                openPickerButton: {
                  sx: {
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.text.secondary
                        : theme.palette.primary.dark,
                  },
                },
              }}
            />
          </FormField>
        </Box>

        <FormField label="Status">
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select {...field} displayEmpty fullWidth sx={fieldControlSx}>
                <MenuItem value="">
                  <Box component="span" color="text.secondary">
                    Choose a status
                  </Box>
                </MenuItem>
                {APPLICATION_STATUSES.map((status) => (
                  <MenuItem value={status} key={status}>
                    {formatStatus(status)}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormField>

        <FormField label="Job listing URL" optional>
          <TextInput type="url" placeholder="https://" {...register("link")} />
        </FormField>

        <FormField label="Salary" optional>
          <TextInput
            type="number"
            placeholder="Annual salary"
            startAdornment={
              <Box component="span" color="text.secondary" mr={1}>
                $
              </Box>
            }
            {...register("salary", {
              setValueAs: (value) => (value === "" ? 0 : Number(value)),
            })}
          />
        </FormField>

        <FormField label="Notes" optional>
          <TextArea
            placeholder="Add context, contacts, or next steps"
            {...register("notes")}
          />
        </FormField>

        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          justifyContent="flex-end"
          gap={1}
          pt={1}
        >
          <TextButton type="button" onClick={closeForm}>
            Cancel
          </TextButton>
          <BaseButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding…" : "Add application"}
          </BaseButton>
        </Stack>
      </FormContainer>
    </FormDrawer>
  );
}
