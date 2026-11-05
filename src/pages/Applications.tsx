import { useContext, useMemo, useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import {
  APPLICATION_STATUSES,
  AppForm,
  ApplicationFilter,
  getApplicationDate,
} from "../lib/applications";
import { AuthContext } from "../context/AuthContext";
import {
  DataTable,
  CreateForm,
  EditForm,
} from "../components/forms/application";
import { Fallback } from "../components/Fallback";
import { useApplications } from "../hooks";
import { getApplicationStats } from "../lib/applicationStats";

const STATUS_FILTERS: ApplicationFilter[] = ["all", ...APPLICATION_STATUSES];
const CHART_HEIGHTS = [30, 48, 39, 65, 54, 78, 92];

export default function Applications() {
  const { user } = useContext(AuthContext);
  const { applications: data, error, isLoading } = useApplications(user?.uid);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<AppForm | null>(null);
  const [status, setStatus] = useState<ApplicationFilter>("all");
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return [...data]
      .filter(
        (application) => status === "all" || application.status === status,
      )
      .filter((application) =>
        [application.company, application.title, application.location ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch),
      )
      .sort((a, b) => {
        return (
          getApplicationDate(b.date_applied).getTime() -
          getApplicationDate(a.date_applied).getTime()
        );
      });
  }, [data, search, status]);

  const { statusCounts, total } = getApplicationStats(data);

  if (isLoading) return <Fallback />;

  if (error) {
    return (
      <Box className="empty-applications">
        <Typography fontWeight={700}>Unable to load applications</Typography>
        <Typography>Please refresh the page and try again.</Typography>
      </Box>
    );
  }

  const { interview: interviews, offer: offers, rejected } = statusCounts;

  return (
    <Box component="main" className="applications">
      <Box className="applications-inner">
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "flex-end" }}
          justifyContent="space-between"
          gap={3}
          className="applications-hero"
        >
          <Box>
            <Typography className="eyebrow">Job search workspace</Typography>
            <Typography variant="h1">Your next move, in motion.</Typography>
            <Typography className="hero-copy">
              Track every opportunity and keep momentum from application to
              offer.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setShowModal(true)}
            className="add-application-button"
          >
            Add application
          </Button>
        </Stack>

        <Box className="stat-grid">
          <Paper className="stat-card stat-card-dark" elevation={0}>
            <Typography>Active applications</Typography>
            <Typography className="stat-value">
              {(total - rejected).toString().padStart(2, "0")}
            </Typography>
            <Box className="mini-bars" aria-hidden="true">
              {CHART_HEIGHTS.map((height) => (
                <Box
                  component="span"
                  key={height}
                  sx={{ height: `${height}%` }}
                />
              ))}
            </Box>
          </Paper>
          <Paper className="stat-card" elevation={0}>
            <Box className="stat-icon stat-icon-warm">
              <CalendarMonthRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography className="stat-value">
                {interviews.toString().padStart(2, "0")}
              </Typography>
              <Typography className="stat-label">Interviews</Typography>
            </Box>
            <Typography className="stat-caption">
              Keep preparing for the next conversation
            </Typography>
          </Paper>
          <Paper className="stat-card" elevation={0}>
            <Box className="stat-icon stat-icon-green">
              <BookmarkBorderRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography className="stat-value">
                {offers.toString().padStart(2, "0")}
              </Typography>
              <Typography className="stat-label">Offers</Typography>
            </Box>
            <Typography className="stat-caption">
              You’re closer than you think
            </Typography>
          </Paper>
          <Paper className="focus-card" elevation={0}>
            <Typography className="focus-label">Weekly focus</Typography>
            <Typography className="focus-title">
              Follow up with three recruiters
            </Typography>
            <Box className="focus-progress">
              <Box component="span" />
            </Box>
            <Typography className="focus-caption">1 of 3 complete</Typography>
          </Paper>
        </Box>

        <Paper
          className="applications-panel"
          elevation={0}
          sx={{ overflowX: "auto" }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={2}
          >
            <Stack direction="row" alignItems="baseline" gap={1.5}>
              <Typography variant="h2">Applications</Typography>
              <Typography className="result-count">
                {filteredData.length} opportunities
              </Typography>
            </Stack>
            <TextField
              size="small"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search roles or companies"
              className="application-search"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>

          <Box className="status-tabs">
            {STATUS_FILTERS.map((option) => (
              <Button
                key={option}
                className={status === option ? "status-tab-selected" : ""}
                onClick={() => setStatus(option)}
              >
                {option}
                {option !== "all" && (
                  <Box component="span">{statusCounts[option]}</Box>
                )}
              </Button>
            ))}
          </Box>

          {filteredData.length ? (
            <DataTable data={filteredData} onEdit={setSelectedApplication} />
          ) : (
            <Box className="empty-applications">
              <Typography fontWeight={700}>No applications found</Typography>
              <Typography>Try another search or status filter.</Typography>
            </Box>
          )}
        </Paper>
      </Box>

      <CreateForm isModalOpen={showModal} setIsModalOpen={setShowModal} />
      <EditForm
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
      />
    </Box>
  );
}
