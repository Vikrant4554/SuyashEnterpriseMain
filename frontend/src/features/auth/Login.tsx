import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", data);
      login(res.data.token, res.data.username);
      navigate("/");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F0F4FA",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorations */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79,70,229,0.12) 0%, transparent 70%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -120,
          right: -80,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(14,165,233,0.08), transparent 70%)",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 420,
          px: 2,
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              boxShadow: "0 8px 24px rgba(79,70,229,0.35)",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.375rem",
                lineHeight: 1,
              }}
            >
              S
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            Suyash Enterprise
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Sign in to your CRM dashboard
          </Typography>
        </Box>

        <Card
          sx={{
            borderRadius: "16px",
            border: "1px solid rgba(226,232,240,0.8)",
            boxShadow:
              "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
            animation: "fadeInScale 0.35s cubic-bezier(0.4,0,0.2,1) forwards",
          }}
        >
          <CardContent sx={{ p: "28px !important" }}>
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2.5 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  fullWidth
                  label="Username"
                  autoFocus
                  autoComplete="username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPwd((p) => !p)}
                          edge="end"
                        >
                          {showPwd ? (
                            <VisibilityOffIcon sx={{ fontSize: 18 }} />
                          ) : (
                            <VisibilityIcon sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 0.5,
                    py: 1.25,
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    background:
                      "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                    boxShadow: "0 4px 14px rgba(79,70,229,0.4)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(79,70,229,0.5)",
                      transform: "translateY(-1px)",
                    },
                    "&:active": { transform: "translateY(0)" },
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={22} sx={{ color: "inherit" }} />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Box>
            </form>

            {/* <Box sx={{ mt: 2.5, p: 1.75, borderRadius: "10px", bgcolor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block", textAlign: "center" }}>
                Default credentials: <strong>admin</strong> / <strong>admin123</strong>
              </Typography>
            </Box> */}
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            display: "block",
            textAlign: "center",
            mt: 2.5,
          }}
        >
          © 2024 Suyash Enterprise. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
