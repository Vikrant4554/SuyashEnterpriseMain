import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Skeleton,
  Tooltip,
  // Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import api from "../../api/axios";
import ServiceFormGlobal from "./ServiceFormGlobal";
import PageContainer from "../../components/PageContainer";

interface Customer {
  _id: string;
  name: string;
  mobileNumber: string;
}
interface Product {
  _id: string;
  productName: string;
  serialNumber: string;
}
interface Service {
  _id: string;
  serviceDate: string;
  workDone: string;
  problemDescription: string;
  partsReplaced: string;
  serviceCharge: number;
  nextServiceDate: string;
  customerId: Customer;
  productId: Product;
}

// const AVATAR_COLORS = [
//   "#4F46E5",
//   "#0EA5E9",
//   "#10B981",
//   "#F59E0B",
//   "#EF4444",
//   "#8B5CF6",
// ];
// const avatarColor = (name: string) =>
//   AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
// const initials = (name: string) =>
//   name
//     ?.split(" ")
//     .map((w) => w[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

export default function ServiceList() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/services", { params: { page, limit: 10 } });
      setServices(res.data.services);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <PageContainer
      title="Services"
      subtitle={`${total} service records`}
      action={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Add Service
        </Button>
      }
    >
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Service Date</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Work Done</TableCell>
              <TableCell>Parts</TableCell>
              <TableCell sx={{ textAlign: "right" }}>Charge</TableCell>
              <TableCell>Next Due</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton width={100} height={16} />
                    </Box>
                  </TableCell>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton height={16} width="70%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <Box sx={{ py: 5, textAlign: "center" }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 500, color: "text.secondary" }}
                    >
                      No services recorded
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", mt: 0.5 }}
                    >
                      Add your first service record to start tracking
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              services.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.25 }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, lineHeight: 1.2 }}
                        >
                          {s.customerId?.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {s.productId?.productName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {new Date(s.serviceDate).toLocaleDateString("en-IN")}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 130 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      noWrap
                    >
                      {s.customerId?.mobileNumber}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 130 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                      noWrap
                    >
                      {s.workDone || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {s.partsReplaced || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ₹{s.serviceCharge}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {new Date(s.nextServiceDate).toLocaleDateString("en-IN")}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                    >
                      <Tooltip title="View customer" arrow>
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(`/customers/${s.customerId?._id}`)
                          }
                          sx={{ color: "primary.main" }}
                        >
                          <PersonIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditing(s);
                            setFormOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}>
          <Pagination
            count={pages}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {formOpen && (
        <ServiceFormGlobal
          open={formOpen}
          service={editing}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSaved={() => {
            setFormOpen(false);
            setEditing(null);
            load();
          }}
        />
      )}
    </PageContainer>
  );
}
