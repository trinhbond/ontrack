import { useContext } from "react";
import { Box, styled, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PieChart } from "@mui/x-charts/PieChart";
import { legendClasses } from "@mui/x-charts/ChartsLegend";
import { AuthContext } from "../context/AuthContext";
import { Fallback } from "../components/Fallback";
import { PieCenterLabel } from "../components/PieCenterLabel";
import { useApplications } from "../hooks";
import { getApplicationStats } from "../lib/applicationStats";

const DashboardCard = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  padding: 16,
}));

const CHART_SETTINGS = {
  margin: { right: 5 },
  height: 300,
};

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { applications, error, isLoading } = useApplications(user?.uid);
  const theme = useTheme();
  const {
    dailyCount,
    monthlyCount,
    percentage,
    pieData,
    statusCounts,
    total,
    weeklyCount,
  } = getApplicationStats(applications);
  const { applied, offer: offers, rejected } = statusCounts;

  if (isLoading) return <Fallback />;

  if (error) {
    return (
      <Box className="dashboard-container">
        <Typography variant="h1">Unable to load dashboard</Typography>
        <Typography>Please refresh the page and try again.</Typography>
      </Box>
    );
  }

  const dividerColor = `1px solid ${theme.palette.divider}`;

  return (
    <Box className="dashboard-container">
      <Box>
        <Typography variant="h1">Dashboard</Typography>
        <Typography color="text.secondary">
          Track your applications here.
        </Typography>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3}>
        <DashboardCard>
          <Box height={160} width={160}>
            <Typography fontWeight={500}>Total Applications</Typography>
            <Box component="span" display="block" color="text.secondary">
              {total}
            </Box>
          </Box>
        </DashboardCard>
        <MetricCard
          label="Applied"
          value={applied}
          total={total}
          percentage={percentage(applied)}
          colors={[
            theme.palette.primary.main,
            alpha(theme.palette.primary.main, 0.14),
          ]}
        />
        <MetricCard
          label="Rejections"
          value={rejected}
          total={total}
          percentage={percentage(rejected)}
          colors={[
            theme.palette.error.main,
            alpha(theme.palette.error.main, 0.14),
          ]}
        />
        <MetricCard
          label="Offers"
          value={offers}
          total={total}
          percentage={percentage(offers)}
          colors={[
            theme.palette.secondary.main,
            alpha(theme.palette.secondary.main, 0.16),
          ]}
          emptyLabel="None"
        />
      </Box>

      <DashboardSection title="Applications by status">
        <DashboardCard>
          <Box width="100%" display="inline-block">
            <PieChart
              slotProps={{
                legend: {
                  direction: "row",
                  padding: 4,
                  labelStyle: { fontSize: 14 },
                  position: { vertical: "bottom", horizontal: "middle" },
                },
              }}
              series={[
                {
                  innerRadius: 50,
                  outerRadius: 100,
                  data: pieData,
                  arcLabel: "value",
                },
              ]}
              sx={{
                [`.${legendClasses.mark}`]: {
                  ry: 10,
                },
              }}
              {...CHART_SETTINGS}
            />
          </Box>
        </DashboardCard>
      </DashboardSection>

      <DashboardSection title="Frequency of applications">
        <DashboardCard>
          <Box display="flex" justifyItems="space-evenly" gap={2}>
            <FrequencyItem
              count={dailyCount}
              label="Today"
              borderRight={dividerColor}
            />
            <FrequencyItem
              count={weeklyCount}
              label="This week"
              borderRight={dividerColor}
            />
            <FrequencyItem count={monthlyCount} label="This month" />
          </Box>
        </DashboardCard>
      </DashboardSection>
    </Box>
  );
}

type MetricCardProps = {
  label: string;
  value: number;
  total: number;
  percentage: number;
  colors: [string, string];
  emptyLabel?: string;
};

function MetricCard({
  colors,
  emptyLabel,
  label,
  percentage,
  total,
  value,
}: MetricCardProps) {
  return (
    <DashboardCard>
      <Typography fontWeight={500}>{label}</Typography>
      <Box component="span" display="block" color="text.secondary">
        {value === 0 && emptyLabel ? emptyLabel : value}
      </Box>
      <Box height={160} width={160}>
        <PieChart
          margin={{ left: 10, right: 10 }}
          series={[
            {
              innerRadius: "80%",
              data: [
                { id: 0, value, color: colors[0] },
                { id: 1, value: total - value, color: colors[1] },
              ],
            },
          ]}
        >
          <PieCenterLabel>{`${Math.round(percentage)}%`}</PieCenterLabel>
        </PieChart>
      </Box>
    </DashboardCard>
  );
}

function DashboardSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Box>
      <Typography className="subheading" component="h2">
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function FrequencyItem({
  borderRight,
  count,
  label,
}: {
  borderRight?: string;
  count: number;
  label: string;
}) {
  return (
    <Box display="inline-block" padding={2} width="100%" sx={{ borderRight }}>
      <Typography className="job-num-count">{count}</Typography>
      <Typography className="job-num-count-label" component="span">
        {label}
      </Typography>
    </Box>
  );
}
