import { useContext, useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../config/firebase";
import { AppForm } from "../lib/form-types";
import { AuthContext } from "../context/AuthContext";
import {
  DataTable,
  CreateForm,
  EditForm,
} from "../components/forms/application";
import {
  Box,
  capitalize,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { statusValues } from "../utils";
import { BasicButton } from "../components/buttons";
import { Fallback } from "../components/Fallback";

export default function Content() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState<AppForm[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSelectedData, setShowSelectedData] = useState<any>({});
  const [statusIndex, setStatusIndex] = useState<number>(0);
  const [prevData, setPrevData] = useState<AppForm>({
    id: "",
    company: "",
    title: "",
    link: "",
    salary: 0,
    notes: "",
    date: new Date(),
    location: "",
    status: "",
  });

  let filteredData;

  if (statusIndex > 0) {
    filteredData = data.filter((props) =>
      props.status.includes(statusValues[statusIndex])
    );
  } else {
    filteredData = data.sort((a, b) => b.date - a.date);
  }

  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return null;

      const q = query(collection(db, "applications", "user/", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const docsData: any = [];
        setIsLoadingData(true);
        try {
          querySnapshot.forEach((doc) => {
            docsData.push({ id: doc.id, ...doc.data() });
          });
          setData(docsData);
          setIsLoadingData(false);
        } catch (error) {
          console.log(error);
        }
      });

      return () => unsubscribe();
    };

    fetchApplications();
  }, [user]);

  if (isLoadingData) return <Fallback />;

  return (
    <Box position="relative" paddingX={3} paddingY={4}>
      <Box display="flex" alignItems="center" gap={2}>
        <BasicButton onClick={toggleModal}>Create</BasicButton>
        <Divider orientation="vertical" flexItem />
        <Select
          sx={{ width: 140 }}
          value={statusValues[statusIndex]}
          onChange={(e: SelectChangeEvent) => {
            setStatusIndex(statusValues.indexOf(e.target.value));
          }}
        >
          {statusValues.map((option, index) => (
            <MenuItem
              value={option}
              key={index}
              selected={index === statusIndex}
            >
              {capitalize(option)}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <CreateForm isModalOpen={showModal} setIsModalOpen={setShowModal} />
      <Box mt={4}>
        {statusIndex > 0 &&
        data.filter((props) => props.status.includes(statusValues[statusIndex]))
          .length == 0 ? (
          <>No results</>
        ) : (
          <>
            <DataTable
              data={filteredData}
              showSelectedData={showSelectedData}
              setShowSelectedData={setShowSelectedData}
              setPrevData={setPrevData}
            />
            <EditForm
              data={filteredData}
              showSelectedData={showSelectedData}
              setShowSelectedData={setShowSelectedData}
              prevData={prevData}
              setPrevData={setPrevData}
            />
          </>
        )}
      </Box>
    </Box>
  );
}
