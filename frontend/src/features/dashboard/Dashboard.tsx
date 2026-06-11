import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
  Avatar,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BuildIcon from "@mui/icons-material/Build";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import api from "../../api/axios";
import PageContainer from "../../components/PageContainer";

interface Stats {
  totalCustomers: number;
  totalProducts: number;
  totalServices: number;
  servicesDueThisMonth: number;
}
interface RecentService {
  _id: string;
  serviceDate: string;
  workDone: string;
  serviceCharge: number;
  customerId: { name: string; mobileNumber: string };
  productId: { productName: string; serialNumber: string };
}
interface UpcomingProduct {
  _id: string;
  productName: string;
  nextServiceDate: string;
  customerId: { name: string; mobileNumber: string };
}

const STAT_CARDS = [
  {
    key: "totalCustomers",
    label: "Total Customers",
    icon: PeopleIcon,
    gradient: "linear-gradient(135deg,#4F46E5,#6366F1)",
    shadow: "rgba(79,70,229,0.3)",
  },
  {
    key: "totalProducts",
    label: "Products Sold",
    icon: ShoppingCartIcon,
    gradient: "linear-gradient(135deg,#0EA5E9,#38BDF8)",
    shadow: "rgba(14,165,233,0.3)",
  },
  {
    key: "totalServices",
    label: "Services Done",
    icon: BuildIcon,
    gradient: "linear-gradient(135deg,#10B981,#34D399)",
    shadow: "rgba(16,185,129,0.3)",
  },
  {
    key: "servicesDueThisMonth",
    label: "Due This Month",
    icon: NotificationsActiveIcon,
    gradient: "linear-gradient(135deg,#EF4444,#F87171)",
    shadow: "rgba(239,68,68,0.3)",
  },
];

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Skeleton
          variant="rounded"
          width={52}
          height={52}
          sx={{ borderRadius: "12px" }}
        />
        <Box flex={1}>
          <Skeleton width="40%" height={36} />
          <Skeleton width="60%" height={18} />
        </Box>
      </CardContent>
    </Card>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  shadow,
  loading,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  shadow: string;
  loading: boolean;
}) {
  if (loading) return <StatCardSkeleton />;
  return (
    <Card
      className="stat-card"
      sx={{ cursor: "default", "&:hover": { transform: "translateY(-2px)" } }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: "20px 24px !important",
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "12px",
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: `0 6px 16px ${shadow}`,
          }}
        >
          <Icon sx={{ color: "#fff", fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.1 }}
          >
            {value.toLocaleString()}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 0.25,
              display: "block",
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function TableSkeleton({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton height={18} width={j === 0 ? "70%" : "50%"} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function SectionCard({
  title,
  linkLabel,
  onLink,
  children,
}: {
  title: string;
  linkLabel?: string;
  onLink?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          {title}
        </Typography>
        {linkLabel && (
          <Box
            onClick={onLink}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              color: "primary.main",
              "&:hover": { opacity: 0.8 },
              transition: "opacity 0.15s",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {linkLabel}
            </Typography>
            <ArrowForwardIosIcon sx={{ fontSize: 11 }} />
          </Box>
        )}
      </Box>
      <TableContainer component={Paper}>{children}</TableContainer>
    </Box>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentServices, setRecentServices] = useState<RecentService[]>([]);
  const [upcomingServices, setUpcomingServices] = useState<UpcomingProduct[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/stats"),
      api.get("/dashboard/recent-services"),
      api.get("/dashboard/upcoming-services"),
    ])
      .then(([s, r, u]) => {
        setStats(s.data);
        setRecentServices(r.data);
        setUpcomingServices(u.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const dueColor = (date: string): "error" | "warning" | "success" => {
    const d = new Date(date),
      now = new Date();
    if (d < now) return "error";
    if (d.getTime() - now.getTime() < 7 * 86400000) return "warning";
    return "success";
  };

  const initials = (name: string) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const AVATAR_COLORS = [
    "#4F46E5",
    "#0EA5E9",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
  ];
  const avatarColor = (name: string) =>
    AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

  return (
    <PageContainer
      title="Dashboard"
      subtitle="Overview of your business activity"
    >
      {/* Stats row */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {STAT_CARDS.map((c) => (
          <Grid key={c.key} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              label={c.label}
              value={stats ? (stats as Record<string, number>)[c.key] : 0}
              icon={c.icon}
              gradient={c.gradient}
              shadow={c.shadow}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Services */}
        <Grid size={{ xs: 12, xl: 6 }}>
          <SectionCard
            title="Recent Services"
            linkLabel="View all"
            onLink={() => navigate("/services")}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Charge</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableSkeleton cols={4} rows={5} />
                ) : recentServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box sx={{ py: 3, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          No services recorded yet
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentServices.map((s) => (
                    <TableRow
                      key={s._id}
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate("/services")}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: 1.25,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: "0.6875rem",
                              fontWeight: 700,
                              bgcolor: avatarColor(s.customerId?.name),
                            }}
                          >
                            {initials(s.customerId?.name)}
                          </Avatar>
                          <Box>
                            <Typography
                              sx={{ fontWeight: 500, lineHeight: 1.2 }}
                              variant="body2"
                            >
                              {s.customerId?.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {s.customerId?.mobileNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {s.productId?.productName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(s.serviceDate).toLocaleDateString("en-IN")}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          sx={{ fontWeight: 600, color: "text.primary" }}
                          variant="body2"
                        >
                          ₹{s.serviceCharge}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </SectionCard>
        </Grid>

        {/* Upcoming Due */}
        <Grid size={{ xs: 12, xl: 6 }}>
          <SectionCard
            title="Upcoming Service Due"
            linkLabel="View all"
            onLink={() => navigate("/service-due")}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Due Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableSkeleton cols={3} rows={5} />
                ) : upcomingServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Box sx={{ py: 3, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          No upcoming services
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  upcomingServices.map((p) => (
                    <TableRow
                      key={p._id}
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate("/service-due")}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexDirection: "row",
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: "0.6875rem",
                              fontWeight: 700,
                              bgcolor: avatarColor(p.customerId?.name),
                            }}
                          >
                            {initials(p.customerId?.name)}
                          </Avatar>
                          <Box>
                            <Typography
                              sx={{ fontWeight: 500, lineHeight: 1 }}
                              variant="body2"
                            >
                              {p.customerId?.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {p.customerId?.mobileNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{p.productName}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          color={dueColor(p.nextServiceDate)}
                          label={new Date(p.nextServiceDate).toLocaleDateString(
                            "en-IN",
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </SectionCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
