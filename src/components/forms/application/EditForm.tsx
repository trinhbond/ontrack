import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import dayjs from "dayjs";
import { deleteDoc, doc, DocumentData, updateDoc } from "firebase/firestore";
import {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { db } from "../../../config/firebase";
import { AuthContext } from "../../../context/AuthContext";
import {
  APPLICATION_STATUSES,
  AppForm,
  EMPTY_APPLICATION,
  formatStatus,
  getApplicationDate,
} from "../../../lib/applications";
import { toastMessage } from "../../../utils";
import { FormContainer } from "../../FormContainer";
import { TextArea } from "../../TextArea";
import { TextInput } from "../../TextInput";
import { BaseButton, TextButton } from "../../buttons";
import FormDrawer from "../FormDrawer";
import FormField, { fieldControlSx } from "../FormField";

type EditFormProps = {
  application: AppForm | null;
  onClose: () => void;
};

export default function EditForm({ application, onClose }: EditFormProps) {
  const { user } = useContext(AuthContext);
  const [draft, setDraft] = useState<AppForm>(EMPTY_APPLICATION);
  const [isSaving, setIsSaving] = useState(false);
  const toastId = useRef("toast");

  useEffect(() => {
    if (application) setDraft(application);
  }, [application]);

  const applicationId = application?.id;
  const isValid = Boolean(draft.company.trim() && draft.title.trim());

  function handleFieldChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setDraft((currentDraft) => ({
      ...currentDraft,
      [name]: name === "salary" ? Number(value) : value,
    }));
  }

  function handleStatusChange(event: SelectChangeEvent) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      status: event.target.value as AppForm["status"],
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user || !applicationId || !isValid) return;

    setIsSaving(true);
    try {
      await updateDoc(
        doc(db, "applications", "user/", user.uid, applicationId),
        draft as DocumentData,
      );
      toastMessage("Your application has been updated", "success", toastId);
      onClose();
    } catch {
      toastMessage("Unable to update your application", "error", toastId);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!user || !applicationId) return;

    try {
      await deleteDoc(
        doc(db, "applications", "user/", user.uid, applicationId),
      );
      toastMessage("Your application has been deleted", "success", toastId);
      onClose();
    } catch {
      toastMessage("Unable to delete your application", "error", toastId);
    }
  }

  return (
    <FormDrawer
      open={Boolean(application)}
      onClose={onClose}
      eyebrow="Application details"
      title="Update application"
      description="Keep the role, status, and next steps current as the process moves forward."
    >
      <FormContainer className="edit-form" onSubmit={handleSubmit}>
        <FormField
          label="Role"
          error={!draft.title.trim() ? "Role is required" : undefined}
        >
          <TextInput
            error={!draft.title.trim()}
            placeholder="Role"
            name="title"
            value={draft.title}
            onChange={handleFieldChange}
          />
        </FormField>

        <FormField
          label="Company"
          error={!draft.company.trim() ? "Company is required" : undefined}
        >
          <TextInput
            error={!draft.company.trim()}
            placeholder="Company"
            name="company"
            value={draft.company}
            onChange={handleFieldChange}
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
            <TextInput
              placeholder="Remote or city"
              name="location"
              value={draft.location ?? ""}
              onChange={handleFieldChange}
            />
          </FormField>
          <FormField label="Date applied">
            <DatePicker
              format="DD/MM/YYYY"
              value={dayjs(getApplicationDate(draft.date_applied))}
              disabled
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: fieldControlSx,
                },
              }}
            />
          </FormField>
        </Box>

        <FormField label="Status">
          <Select
            name="status"
            value={draft.status}
            onChange={handleStatusChange}
            displayEmpty
            fullWidth
            sx={fieldControlSx}
          >
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
        </FormField>

        <FormField label="Job listing URL" optional>
          <TextInput
            type="url"
            placeholder="https://"
            name="link"
            value={draft.link ?? ""}
            onChange={handleFieldChange}
          />
        </FormField>

        <FormField label="Salary" optional>
          <TextInput
            type="number"
            placeholder="Annual salary"
            name="salary"
            value={draft.salary || ""}
            startAdornment={
              <Box component="span" color="text.secondary" mr={1}>
                $
              </Box>
            }
            onChange={handleFieldChange}
          />
        </FormField>

        <FormField label="Notes" optional>
          <TextArea
            placeholder="Add context, contacts, or next steps"
            name="notes"
            value={draft.notes}
            onChange={handleFieldChange}
          />
        </FormField>

        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          justifyContent="space-between"
          gap={1}
          pt={1}
        >
          <Button
            type="button"
            color="error"
            startIcon={<DeleteOutlineRoundedIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Stack direction={{ xs: "column-reverse", sm: "row" }} gap={1}>
            <TextButton type="button" onClick={onClose}>
              Cancel
            </TextButton>
            <BaseButton type="submit" disabled={!isValid || isSaving}>
              {isSaving ? "Saving…" : "Save changes"}
            </BaseButton>
          </Stack>
        </Stack>
      </FormContainer>
    </FormDrawer>
  );
}
