import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, TextField, InputAdornment, Card, CardContent, CardActionArea,
  Grid, CircularProgress, Alert, Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import api from "../../api/axios";
import PageContainer from "../../components/PageContainer";

interface Customer { _id: string; name: string; mobileNumber: string; alternateNumber?: string; address: string; notes?: string; }

const AVATAR_COLORS = ["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
const avatarColor = (name: string) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
const initials = (name: string) => name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length < 2) { setResults([]); setSearched(false); return; }
    setLoading(true);
    try {
      const res = await api.get("/customers/search", { params: { q: val } });
      setResults(res.data);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Search" subtitle="Find customers by name, mobile, or serial number">
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by customer name, mobile number, or product serial number..."
          value={query}
          onChange={e => handleSearch(e.target.value)}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {loading
                  ? <CircularProgress size={18} />
                  : <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                }
              </InputAdornment>
            ),
            sx: { borderRadius: "10px", fontSize: "0.9375rem", py: 0.25 },
          }}
        />
      </Box>

      {!searched && !loading && (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Box sx={{ width: 64, height: 64, borderRadius: "16px", bgcolor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
            <PersonSearchIcon sx={{ fontSize: 32, color: "primary.main" }} />
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500, color: "text.secondary" }}>Start typing to search</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Search by customer name, mobile number, or product serial number</Typography>
        </Box>
      )}

      {searched && results.length === 0 && !loading && (
        <Alert severity="info" sx={{ borderRadius: "10px" }}>No customers found matching "{query}"</Alert>
      )}

      <Grid container spacing={2}>
        {results.map(c => (
          <Grid key={c._id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: "100%", cursor: "pointer" }}>
              <CardActionArea onClick={() => navigate(`/customers/${c._id}`)} sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.75 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: "10px", flexShrink: 0, background: avatarColor(c.name), display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.875rem" }}>{initials(c.name)}</Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{c.name}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                      <Typography variant="body2">{c.mobileNumber}</Typography>
                      {c.alternateNumber && <Chip size="small" label={c.alternateNumber} sx={{ fontSize: "0.6875rem" }} />}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                      <HomeIcon sx={{ fontSize: 14, color: "text.secondary", mt: "2px", flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.4 }}>{c.address}</Typography>
                    </Box>
                    {c.notes && (
                      <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.25, fontStyle: "italic" }} noWrap>
                        {c.notes}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </PageContainer>
  );
}
