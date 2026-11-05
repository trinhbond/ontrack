import { useState } from "react";
import { AppForm, getApplicationDate } from "../../../lib/applications";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Chip,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

export default function DataTable({
  data,
  onEdit,
}: {
  data: AppForm[];
  onEdit: (application: AppForm) => void;
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  return (
    <>
      <TableContainer className="applications-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company / role</TableCell>
              <TableCell className="optional-table-cell">Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell className="optional-table-cell">Salary</TableCell>
              <TableCell>Date</TableCell>
              <TableCell width={48} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((application) => {
                const appliedDate = getApplicationDate(
                  application.date_applied,
                );
                return (
                  <TableRow key={application.id} className="application-row">
                    <TableCell>
                      <StackedCompany application={application} />
                    </TableCell>
                    <TableCell className="optional-table-cell">
                      {application.location || "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        className={`status-chip status-${application.status || "all"}`}
                        label={application.status || "No status"}
                      />
                    </TableCell>
                    <TableCell className="optional-table-cell">
                      {application.salary > 0
                        ? `$${Number(application.salary).toLocaleString()}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {Number.isNaN(appliedDate.getTime())
                        ? "—"
                        : appliedDate.toLocaleDateString("en-NZ", {
                            day: "2-digit",
                            month: "short",
                          })}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        aria-label={`Edit ${application.title} at ${application.company}`}
                        onClick={() => onEdit(application)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={Math.min(
          page,
          Math.max(0, Math.ceil(data.length / rowsPerPage) - 1),
        )}
        onPageChange={(_event, nextPage) => setPage(nextPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 15, 30]}
        labelRowsPerPage="Rows"
      />
    </>
  );
}

function StackedCompany({ application }: { application: AppForm }) {
  const companyName = application.company || "Unknown";
  const content = (
    <Box className="company-cell">
      <Box className="company-initial">
        {companyName.charAt(0).toUpperCase()}
      </Box>
      <Box minWidth={0}>
        <Typography className="company-name">{companyName}</Typography>
        <Typography className="role-name">{application.title}</Typography>
      </Box>
    </Box>
  );

  return application.link ? (
    <Link
      href={application.link}
      target="_blank"
      rel="noreferrer"
      underline="none"
    >
      {content}
    </Link>
  ) : (
    content
  );
}
