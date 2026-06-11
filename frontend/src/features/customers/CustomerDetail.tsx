import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import api from "../../api/axios";
import CustomerForm from "./CustomerForm";
import ProductForm from "../products/ProductForm";
import ServiceForm from "../services/ServiceForm";

interface Customer { _id: string; name: string; mobileNumber: string; alternateNumber?: string; address: string; notes?: string; }
interface Product { _id: string; productName: string; category: string; brand: string; model: string; serialNumber: string; purchaseDate: string; salePrice: number; nextServiceDate: string; }
interface Service { _id: string; serviceDate: string; workDone: string; problemDescription: string; partsReplaced: string; serviceCharge: number; nextServiceDate: string; productId: { productName: string; serialNumber: string } | null; }

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [serviceFormOpen, setServiceFormOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/customers/${id}`);
      setCustomer(res.data.customer);
      setProducts(res.data.products);
      setServices(res.data.services);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}><CircularProgress /></Box>;
  if (!customer) return <Typography>Customer not found</Typography>;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/customers")}>Back</Button>
        <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1 }}>{customer.name}</Typography>
        <Button startIcon={<EditIcon />} variant="outlined" onClick={() => setEditOpen(true)}>Edit</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Customer Info</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>Mobile</Typography>
                  <Typography>{customer.mobileNumber}</Typography>
                </Box>
                {customer.alternateNumber && (
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>Alternate</Typography>
                    <Typography>{customer.alternateNumber}</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>Address</Typography>
                  <Typography>{customer.address}</Typography>
                </Box>
                {customer.notes && (
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>Notes</Typography>
                    <Typography>{customer.notes}</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Products ({products.length})</Typography>
            <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={() => setProductFormOpen(true)}>
              Add Product
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Serial No.</TableCell>
                  <TableCell>Purchase Date</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Next Service</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center" }}>No products</TableCell>
                  </TableRow>
                ) : products.map(p => (
                  <TableRow key={p._id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{p.productName}</Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>{p.brand} {p.model}</Typography>
                    </TableCell>
                    <TableCell>{p.serialNumber}</TableCell>
                    <TableCell>{new Date(p.purchaseDate).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell>₹{p.salePrice}</TableCell>
                    <TableCell>
                      <Chip size="small"
                        label={new Date(p.nextServiceDate).toLocaleDateString("en-IN")}
                        color={new Date(p.nextServiceDate) < new Date() ? "error" : "success"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Service History ({services.length})</Typography>
        <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={() => setServiceFormOpen(true)}>
          Add Service
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Problem</TableCell>
              <TableCell>Work Done</TableCell>
              <TableCell>Parts</TableCell>
              <TableCell>Charge</TableCell>
              <TableCell>Next Due</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center" }}>No service history</TableCell>
              </TableRow>
            ) : services.map(s => (
              <TableRow key={s._id} hover>
                <TableCell>{new Date(s.serviceDate).toLocaleDateString("en-IN")}</TableCell>
                <TableCell>{s.productId?.productName || "-"}</TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.problemDescription || "-"}</TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.workDone || "-"}</TableCell>
                <TableCell>{s.partsReplaced || "-"}</TableCell>
                <TableCell>₹{s.serviceCharge}</TableCell>
                <TableCell>{new Date(s.nextServiceDate).toLocaleDateString("en-IN")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomerForm open={editOpen} customer={customer} onClose={() => setEditOpen(false)} onSaved={() => { setEditOpen(false); load(); }} />
      <ProductForm open={productFormOpen} customerId={customer._id} product={null} onClose={() => setProductFormOpen(false)} onSaved={() => { setProductFormOpen(false); load(); }} />
      <ServiceForm open={serviceFormOpen} customerId={customer._id} products={products} service={null} onClose={() => setServiceFormOpen(false)} onSaved={() => { setServiceFormOpen(false); load(); }} />
    </Box>
  );
}
