import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Pagination,
  Skeleton, InputAdornment, Avatar, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../api/axios";
import CustomerForm from "./CustomerForm";
import PageContainer from "../../components/PageContainer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { store } from "../../store/index";
import {
  setCustomersLoading,
  setCustomersList,
  setCustomersFailed,
} from "../../store/slices/customersSlice";

const AVATAR_COLORS = ["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
const avatarColor = (name: string) =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
const initials = (name: string) =>
  name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export default function CustomerList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { list: customers, total, pages, status } = useAppSelector((s) => s.customers);
  const loading = status !== "succeeded";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<(typeof customers)[0] | null>(null);

  const load = (p: number, s: string) => {
    if (store.getState().customers.status === 'loading') return;
    dispatch(setCustomersLoading());
    api.get('/customers', { params: { page: p, limit: 10, search: s || undefined } })
      .then((res) => dispatch(setCustomersList(res.data)))
      .catch(() => dispatch(setCustomersFailed()));
  };

  useEffect(() => {
    load(page, search);
  }, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <PageContainer
      title="Customers"
      subtitle={`${total} total customers`}
      action={
        <Box sx={{ mb: 1 }}>
          <TextField
            placeholder="Search by name or mobile number..."
            size="small"
            sx={{ width: { xs: "100%", sm: 320 }, mr: 1 }}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => { setEditing(null); setFormOpen(true); }}
          >
            Add Customer
          </Button>
        </Box>
      }
    >
      <Box sx={{ mb: 2.5 }}></Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Alternate</TableCell>
              <TableCell>Address</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Box>
                        <Skeleton width={120} height={16} />
                        <Skeleton width={80} height={13} sx={{ mt: 0.5 }} />
                      </Box>
                    </Box>
                  </TableCell>
                  {[1, 2, 3, 4].map((j) => (
                    <TableCell key={j}><Skeleton width="70%" height={16} /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box sx={{ py: 5, textAlign: "center" }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: "text.secondary" }}>
                      No customers found
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                      {search ? `No results for "${search}"` : "Add your first customer to get started"}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32, height: 32, fontSize: "0.75rem",
                          fontWeight: 700, bgcolor: avatarColor(c.name), flexShrink: 0,
                        }}
                      >
                        {initials(c.name)}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{c.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{c.mobileNumber}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {c.alternateNumber || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 220 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                      {c.address}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                      <Tooltip title="View details" arrow>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/customers/${c._id}`)}
                          sx={{ color: "primary.main" }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          size="small"
                          onClick={() => { setEditing(c); setFormOpen(true); }}
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

      <CustomerForm
        open={formOpen}
        customer={editing}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSaved={() => {
          setFormOpen(false);
          setEditing(null);
          // Force re-fetch after save by bypassing the loading guard
          dispatch(setCustomersLoading());
          api.get('/customers', { params: { page, limit: 10, search: search || undefined } })
            .then((res) => dispatch(setCustomersList(res.data)))
            .catch(() => dispatch(setCustomersFailed()));
        }}
      />
    </PageContainer>
  );
}
