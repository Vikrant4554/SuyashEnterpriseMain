import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Skeleton, Avatar,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import api from "../../api/axios";
import PageContainer from "../../components/PageContainer";

interface Product {
  _id: string; productName: string; nextServiceDate: string;
  customerId: { _id: string; name: string; mobileNumber: string; address: string };
}

const AVATAR_COLORS = ["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
const avatarColor = (name: string) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
const initials = (name: string) => name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

export default function ServiceDue() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("month");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/services/due", { params: { filter } }).then(res => setProducts(res.data)).finally(() => setLoading(false));
  }, [filter]);

  const dueColor = (date: string): "error" | "warning" | "success" => {
    const d = new Date(date), now = new Date();
    if (d < now) return "error";
    if (d.getTime() - now.getTime() < 7 * 86400000) return "warning";
    return "success";
  };

  const dueLabel = (date: string) => {
    const d = new Date(date), now = new Date();
    if (d < now) return "Overdue";
    const days = Math.ceil((d.getTime() - now.getTime()) / 86400000);
    if (days === 0) return "Today";
    if (days <= 7) return `In ${days}d`;
    return d.toLocaleDateString("en-IN");
  };

  const overdueCount = products.filter(p => new Date(p.nextServiceDate) < new Date()).length;

  return (
    <PageContainer
      title="Service Due"
      subtitle={overdueCount > 0 ? `${overdueCount} overdue · ${products.length} total in view` : `${products.length} services due`}
      action={
        <ToggleButtonGroup value={filter} exclusive onChange={(_, v) => v && setFilter(v)} size="small">
          <ToggleButton value="today">Today</ToggleButton>
          <ToggleButton value="week">This Week</ToggleButton>
          <ToggleButton value="month">This Month</ToggleButton>
        </ToggleButtonGroup>
      }
    >
      {overdueCount > 0 && !loading && (
        <Box sx={{ mb: 2.5, p: 2, borderRadius: "10px", bgcolor: "#FEF2F2", border: "1px solid #FECACA", display: "flex", alignItems: "center", gap: 1.5 }}>
          <NotificationsActiveIcon sx={{ color: "error.main", fontSize: 20 }} />
          <Typography variant="body2" sx={{ fontWeight: 500, color: "error.dark" }}>
            {overdueCount} customer{overdueCount > 1 ? "s" : ""} with overdue service — follow up immediately.
          </Typography>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton width={100} height={16} />
                    </Box>
                  </TableCell>
                  {[1, 2, 3, 4, 5].map(j => (
                    <TableCell key={j}><Skeleton height={16} width="70%" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ py: 6, textAlign: "center" }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: "text.secondary" }}>
                      No services due for this period
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                      All customers are up to date
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : products.map(p => (
              <TableRow key={p._id} sx={{ cursor: "pointer" }} onClick={() => navigate(`/customers/${p.customerId?._id}`)}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: "0.75rem", fontWeight: 700, bgcolor: avatarColor(p.customerId?.name), flexShrink: 0 }}>
                      {initials(p.customerId?.name)}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{p.customerId?.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell><Typography variant="body2">{p.customerId?.mobileNumber}</Typography></TableCell>
                <TableCell sx={{ maxWidth: 180 }}><Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>{p.customerId?.address}</Typography></TableCell>
                <TableCell><Typography variant="body2">{p.productName}</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ color: "text.secondary" }}>{new Date(p.nextServiceDate).toLocaleDateString("en-IN")}</Typography></TableCell>
                <TableCell>
                  <Chip size="small" color={dueColor(p.nextServiceDate)} label={dueLabel(p.nextServiceDate)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
}
