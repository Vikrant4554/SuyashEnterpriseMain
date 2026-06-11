import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BuildIcon from "@mui/icons-material/Build";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useAuth } from "../context/AuthContext";
import { alpha } from "@mui/material/styles";

const DRAWER_WIDTH = 248;

const SIDEBAR_BG = "#16213E";
const SIDEBAR_HOVER = alpha("#FFFFFF", 0.07);
const SIDEBAR_ACTIVE_BG = alpha("#4F46E5", 0.25);
const SIDEBAR_ACTIVE_BORDER = "#6366F1";
const SIDEBAR_TEXT = "#FFFFFF";
const SIDEBAR_ICON = "#fff";

const navItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: <DashboardIcon sx={{ fontSize: 20 }} />,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: <PeopleIcon sx={{ fontSize: 20 }} />,
  },
  {
    label: "Products",
    path: "/products",
    icon: <ShoppingCartIcon sx={{ fontSize: 20 }} />,
  },
  {
    label: "Services",
    path: "/services",
    icon: <BuildIcon sx={{ fontSize: 20 }} />,
  },
  {
    label: "Service Due",
    path: "/service-due",
    icon: <NotificationsActiveIcon sx={{ fontSize: 20 }} />,
  },
  {
    label: "Search",
    path: "/search",
    icon: <SearchIcon sx={{ fontSize: 20 }} />,
  },
];

function SidebarContent({
  currentPath,
  onNavigate,
}: {
  currentPath: string;
  onNavigate: (p: string) => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: SIDEBAR_BG,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          px: 2.5,
          py: 3,
          borderBottom: `1px solid ${alpha("#FFFFFF", 0.08)}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "9px",
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(79,70,229,0.4)",
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 800,
                fontSize: "0.875rem",
                lineHeight: 1,
              }}
            >
              S
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.9375rem",
                lineHeight: 1.2,
              }}
            >
              Suyash
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontSize: "0.6875rem",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Enterprise
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Nav */}
      <Box sx={{ flex: 1, overflow: "auto", py: 1.5, px: 1.5 }}>
        <Typography
          sx={{
            color: "#fff",
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            px: 1,
            mb: 1,
          }}
        >
          Menu
        </Typography>
        <List
          disablePadding
          sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}
        >
          {navItems.map((item) => {
            const active = currentPath === item.path;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => onNavigate(item.path)}
                  sx={{
                    borderRadius: "8px",
                    py: 1,
                    px: 1.25,
                    borderLeft: active
                      ? `2px solid ${SIDEBAR_ACTIVE_BORDER}`
                      : "2px solid transparent",
                    bgcolor: active ? SIDEBAR_ACTIVE_BG : "transparent",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: active ? SIDEBAR_ACTIVE_BG : SIDEBAR_HOVER,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 34,
                      color: active ? "#fafafa" : SIDEBAR_ICON,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: active ? 600 : 500,
                      color: active ? "#FFF" : SIDEBAR_TEXT,
                      lineHeight: 1,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${alpha("#FFFFFF", 0.08)}` }}>
        <Typography
          sx={{
            color: "#fff",
            fontSize: "0.6875rem",
            textAlign: "center",
          }}
        >
          CRM v1.0 · Suyash Enterprise
        </Typography>
      </Box>
    </Box>
  );
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Sidebar - mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, border: "none" },
        }}
      >
        <SidebarContent
          currentPath={location.pathname}
          onNavigate={handleNavigate}
        />
      </Drawer>

      {/* Sidebar - desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            border: "none",
            boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
          },
        }}
        open
      >
        <SidebarContent
          currentPath={location.pathname}
          onNavigate={handleNavigate}
        />
      </Drawer>

      {/* Main area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          ml: { sm: `${DRAWER_WIDTH}px` },
          minWidth: 0,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        {/* Top bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            color: "text.primary",
            backdropFilter: "blur(8px)",
            width: "100%",
            left: "auto",
          }}
        >
          <Toolbar sx={{ minHeight: "60px !important", px: { xs: 2, sm: 3 } }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 1, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Page title from nav */}
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
              sx={{ flexGrow: 1 }}
            >
              {navItems.find((n) => n.path === location.pathname)?.label ??
                "Suyash Enterprise"}
            </Typography>

            {/* User menu */}
            <Tooltip title="Account settings" arrow>
              <Box
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexDirection: "row",
                  cursor: "pointer",
                  px: 1.5,
                  py: 0.75,
                  borderRadius: "8px",
                  transition: "background 0.15s",
                  "&:hover": { bgcolor: "grey.100" },
                }}
              >
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    bgcolor: "primary.main",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                  }}
                >
                  {username?.[0]?.toUpperCase()}
                </Avatar>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  {username}
                </Typography>
                <KeyboardArrowDownIcon
                  sx={{ fontSize: 16, color: "text.secondary" }}
                />
              </Box>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              slotProps={{
                paper: {
                  elevation: 4,
                  sx: {
                    mt: 0.5,
                    minWidth: 180,
                    borderRadius: "10px",
                    border: "1px solid",
                    borderColor: "divider",
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  px: 2,
                  py: 1.25,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    whiteSpace: "nowrap",
                    pr: 0.5,
                    fontSize: 13,
                  }}
                >
                  Signed in as
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: 14,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {username}
                </Typography>
              </Box>
              <Divider />
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  logout();
                  navigate("/login");
                }}
                sx={{
                  fontSize: "0.875rem",
                  color: "error.main",
                  fontWeight: 500,
                  borderRadius: "6px",
                  mx: 0.5,
                  my: 0.25,
                }}
              >
                Sign out
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box
          component="main"
          sx={{ flex: 1, p: { xs: 2, sm: 3, md: 3.5 }, overflow: "auto" }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
