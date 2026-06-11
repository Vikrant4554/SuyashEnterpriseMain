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
  Chip,
  Skeleton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import api from "../../api/axios";
import ProductForm from "./ProductForm";
import PageContainer from "../../components/PageContainer";

interface Customer { _id: string; name: string; mobileNumber: string; }
interface Product {
  _id: string; productName: string; category: string; brand: string;
  model: string; serialNumber: string; purchaseDate: string;
  salePrice: number; nextServiceDate: string; customerId: Customer;
}

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", { params: { page, limit: 10 } });
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const dueColor = (date: string): "error" | "success" =>
    new Date(date) < new Date() ? "error" : "success";

  return (
    <PageContainer
      title="Products"
      subtitle={`${total} products sold`}
      action={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditing(null); setFormOpen(true); }}
        >
          Record Sale
        </Button>
      }
    >

      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Purchase Date</TableCell>
              <TableCell sx={{ textAlign: "right" }}>Price</TableCell>
              <TableCell>Next Service</TableCell>
              <TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton height={16} width="70%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Box sx={{ py: 5, textAlign: "center" }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: "text.secondary" }}>
                      No products recorded
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                      Record your first product sale to get started
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {p.customerId?.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {p.productName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {p.brand} {p.model}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={p.category} size="small" variant="outlined" sx={{ fontSize: "0.75rem" }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                      {p.customerId?.mobileNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {new Date(p.purchaseDate).toLocaleDateString("en-IN")}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ₹{p.salePrice.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={dueColor(p.nextServiceDate)}
                      label={new Date(p.nextServiceDate).toLocaleDateString("en-IN")}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                      <Tooltip title="View customer" arrow>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/customers/${p.customerId?._id}`)}
                          sx={{ color: "primary.main" }}
                        >
                          <PersonIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          size="small"
                          onClick={() => { setEditing(p); setFormOpen(true); }}
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
        <ProductForm
          open={formOpen}
          customerId={editing?.customerId?._id || ""}
          product={editing}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => { setFormOpen(false); setEditing(null); load(); }}
        />
      )}
    </PageContainer>
  );
}
