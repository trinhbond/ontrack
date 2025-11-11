import {
  Box,
  FormControl,
  Input,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { AppForm } from "../../../lib/form-types";
import { useContext, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { notify, statusValues } from "../../../utils";
import { Controller, useForm } from "react-hook-form";
import { TextArea } from "../../TextArea";
import { ModalContentWrapper } from "../../ModalContentWrapper";
import { FormContainer } from "../../FormContainer";
import { TextButton, BasicButton } from "../../buttons";

export default function CreateForm({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user } = useContext(AuthContext);
  const {
    handleSubmit,
    reset,
    control,
    register,
    formState: { errors },
  } = useForm<AppForm>();
  const toastId = useRef("toast");

  const handleAddApplication = handleSubmit(async (data) => {
    if (!user) return null;

    await addDoc(collection(db, "applications", "user/", user.uid), {
      ...data,
      date: new Date(),
    }).catch((error) => console.log(error));
    notify("Your application has been added", "success", toastId);
    setIsModalOpen(!isModalOpen);
    reset();
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    reset();
  };

  return (
    <Modal open={isModalOpen} onClose={toggleModal}>
      <ModalContentWrapper
        p={2}
        width={{ xs: "100%", sm: 384, md: 384, lg: 384 }}
      >
        <Box component="div" fontSize={20} fontWeight={500} mb={3}>
          New application
        </Box>
        <FormContainer className="create-form" onSubmit={handleAddApplication}>
          <Box display="flex" flexDirection="column">
            <FormControl>
              <Box component="label">Role</Box>
              <Controller
                control={control}
                name={"title"}
                render={() => (
                  <Input
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
            </FormControl>
          </Box>
          <Box display="flex" flexDirection="column">
            <FormControl>
              <Box component="label">Company</Box>
              <Controller
                control={control}
                name={"company"}
                render={() => (
                  <Input
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
            </FormControl>
          </Box>
          <Box display="flex" flexDirection="column">
            <FormControl>
              <Box component="label">Location</Box>
              <Controller
                control={control}
                name={"location"}
                render={() => (
                  <Input placeholder="Location" {...register("location")} />
                )}
              />
            </FormControl>
          </Box>
          <Box display="flex" flexDirection="column">
            <FormControl>
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
            </FormControl>
          </Box>
          <Box display="flex" flexDirection="column">
            <FormControl>
              <Box component="label">Link</Box>
              <Controller
                control={control}
                name={"link"}
                render={() => (
                  <Input placeholder="Link" {...register("link")} />
                )}
              />
            </FormControl>
          </Box>
          <Box display="flex" flexDirection="column">
            <FormControl>
              <Box component="label">Salary</Box>
              <Controller
                control={control}
                name={"salary"}
                render={() => (
                  <Input
                    type="number"
                    placeholder="Salary"
                    {...register("salary")}
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box display="flex" flexDirection="column">
            <FormControl>
              <Box component="label">Notes</Box>
              <Controller
                control={control}
                name={"notes"}
                render={() => (
                  <TextArea placeholder="Notes" {...register("notes")} />
                )}
              />
            </FormControl>
          </Box>
          <Box>
            <BasicButton type="submit">Confirm</BasicButton>
            <Box display="inline-block" ml={1} paddingX={1} paddingY={2}>
              <TextButton onClick={toggleModal}>Cancel</TextButton>
            </Box>
          </Box>
        </FormContainer>
      </ModalContentWrapper>
    </Modal>
  );
}
