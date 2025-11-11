import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Box, Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import EditUserForm from "../components/forms/auth/EditUserForm";
import { BasicButton } from "../components/buttons";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setValue } = useForm({
    defaultValues: {
      name: user?.displayName,
    },
  });

  const toggleModal = () => setIsOpen(!isOpen);

  const handleUserChange = () => {
    if (!user) return;
    setValue("name", user.displayName);
    toggleModal();
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box paddingX={3} paddingY={4}>
      <Box alignItems="flex-start" display="flex" justifyItems="between">
        <Box width="100%" display="flex" flexDirection="column" gap={1}>
          <Box>
            <Box component="span">Name</Box>
            <Box color="#95959D">{user.displayName}</Box>
          </Box>
          <Box>
            <Box component="span">Email</Box>
            <Box color="#95959D">{user.email}</Box>
          </Box>
          <Box>
            <Box component="span">Account created</Box>
            <Box color="#95959D">{user.metadata.creationTime}</Box>
          </Box>
          <Box>
            <Box component="span">Account verified</Box>
            <Box color="#95959D">{user.emailVerified ? "Yes" : "No"}</Box>
          </Box>
        </Box>
        <BasicButton onClick={handleUserChange}>Edit</BasicButton>
      </Box>
      <Modal open={isOpen} onClose={toggleModal}>
        <Box>
          <EditUserForm onClick={handleUserChange} />
        </Box>
      </Modal>
    </Box>
  );
}
