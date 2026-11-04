import {
  Box,
  FormControl,
  Input,
  MenuItem,
  Modal,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { AppForm } from "../../../lib/form-types";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { toastMessage, statusValues } from "../../../utils";
import { Controller, useForm } from "react-hook-form";
import { TextArea } from "../../TextArea";
import { ModalContentWrapper } from "../../ModalContentWrapper";
import { FormContainer } from "../../FormContainer";
import { TextButton, BaseButton } from "../../buttons";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

export default function CreateForm({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));
  const {
    handleSubmit,
    reset,
    control,
    register,
    formState: { errors },
  } = useForm<AppForm>();
  const theme = useTheme();
  const toastId = useRef("toast");

  const handleAddApplication = handleSubmit(async (data) => {
    if (!user) return null;

    try {
      await addDoc(collection(db, "applications", "user/", user.uid), {
        ...data,
        date_applied: date?.toDate(),
      });
      toastMessage("Your application has been added", "success", toastId);
      setIsModalOpen(false);
      reset();
    } catch {
      toastMessage("Unable to add your application", "error", toastId);
    }
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    reset();
  };

  const inputCSS = {
    background: theme.palette.mode === "dark" ? "inherit" : "#fff",
    border:
      theme.palette.mode === "dark"
        ? "0.5px solid #272727"
        : "0.5px solid #e5e7eb",
  };

  return (
    <Modal open={isModalOpen} onClose={toggleModal}>
      <ModalContentWrapper
        boxShadow={1}
        sx={{
          background:
            theme.palette.mode === "dark"
              ? theme.palette.primary.dark
              : theme.palette.primary.light,
        }}
        width={{ xs: "100%", sm: 384, md: 384, lg: 384 }}
      >
        <Box component="div" fontSize={20} fontWeight={500} mb={3}>
          New application
        </Box>
        <FormContainer className="create-form" onSubmit={handleAddApplication}>
          <FormControl>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box component="label">Role</Box>
              <Controller
                control={control}
                name={"title"}
                render={() => (
                  <Input
                    sx={{ ...inputCSS }}
                    error={!!errors.title}
                    placeholder="Role"
                    {...register("title", {
                      required: {
                        value: true,
                        message: "Title is required",
                      },
                      pattern: {
                        value: /[^' ']+/,
                        message: "Title is required",
                      },
                    })}
                  />
                )}
              />
              {errors.title && (
                <Typography component="p" role="alert">
                  {errors.title.message}
                </Typography>
              )}
            </Box>
          </FormControl>
          <FormControl>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box component="label">Company</Box>
              <Controller
                control={control}
                name={"company"}
                render={() => (
                  <Input
                    sx={{ ...inputCSS }}
                    error={!!errors.company}
                    placeholder="Company"
                    {...register("company", {
                      required: {
                        value: true,
                        message: "Company is required",
                      },
                      pattern: {
                        value: /[^' ']+/,
                        message: "Company is required",
                      },
                    })}
                  />
                )}
              />
              {errors.company && (
                <Typography component="p" role="alert">
                  {errors.company.message}
                </Typography>
              )}
            </Box>
          </FormControl>
          <FormControl>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box component="label">Location</Box>
              <Controller
                control={control}
                name={"location"}
                render={() => (
                  <Input
                    sx={{ ...inputCSS }}
                    placeholder="Location"
                    {...register("location")}
                  />
                )}
              />
            </Box>
          </FormControl>
          <FormControl>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box component="label">Date</Box>
              <Controller
                control={control}
                name={"date_applied"}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    format="DD/MM/YYYY"
                    value={dayjs(field.value as Date)}
                    onChange={(date) => {
                      field.onChange(date);
                      return setDate(date);
                    }}
                  />
                )}
              />
            </Box>
          </FormControl>
          <FormControl>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box component="label">Status</Box>
              <Controller
                control={control}
                name={"status"}
                render={() => (
                  <FormControl>
                    <Select
                      {...register("status")}
                      displayEmpty
                      defaultValue=""
                      sx={{
                        border:
                          theme.palette.mode === "dark"
                            ? "0.5px solid #272727"
                            : "0.5px solid #e5e7eb",
                        background:
                          theme.palette.mode === "dark" ? "inherit" : "#fff",
                        ":focus": { border: "none" },
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {statusValues.slice(1).map((option) => (
                        <MenuItem value={option} key={option}>
                          {option.slice(0, 1).toUpperCase() +
                            option.substring(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          </FormControl>
          <FormControl>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box component="label">Link</Box>
              <Controller
                control={control}
                name={"link"}
                render={() => (
                  <Input
                    sx={{ ...inputCSS }}
                    placeholder="Link"
                    {...register("link")}
                  />
                )}
              />
            </Box>
          </FormControl>
          <FormControl>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box component="label">Salary</Box>
              <Controller
                control={control}
                name={"salary"}
                render={() => (
                  <Input
                    sx={{ ...inputCSS }}
                    type="number"
                    placeholder="Salary"
                    {...register("salary")}
                  />
                )}
              />
            </Box>
          </FormControl>
          <FormControl>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box component="label">Notes</Box>
              <Controller
                control={control}
                name={"notes"}
                render={() => (
                  <TextArea
                    style={{
                      border:
                        theme.palette.mode === "dark"
                          ? "0.5px solid #272727"
                          : "0.5px solid #e5e7eb",
                      background:
                        theme.palette.mode === "dark" ? "inherit" : "#fff",
                    }}
                    placeholder="Notes"
                    {...register("notes")}
                  />
                )}
              />
            </Box>
          </FormControl>
          <Box>
            <BaseButton type="submit">Confirm</BaseButton>
            <Box display="inline-block" ml={1} paddingX={1} paddingY={2}>
              <TextButton onClick={toggleModal}>Cancel</TextButton>
            </Box>
          </Box>
        </FormContainer>
      </ModalContentWrapper>
    </Modal>
  );
}
