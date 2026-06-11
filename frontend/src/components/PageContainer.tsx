import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface BreadcrumbItem { label: string; href?: string; }

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
}

export default function PageContainer({ title, subtitle, action, breadcrumbs, children }: Props) {
  const navigate = useNavigate();
  return (
    <Box className="page-enter">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs sx={{ mb: 0.5 }}>
              {breadcrumbs.map((b, i) =>
                b.href ? (
                  <Link key={i} component="button" variant="caption"
                    onClick={() => navigate(b.href!)}
                    sx={{ cursor: "pointer", color: "text.secondary", "&:hover": { color: "primary.main" }, transition: "color 0.15s" }}>
                    {b.label}
                  </Link>
                ) : (
                  <Typography key={i} variant="caption" sx={{ color: "text.secondary" }}>{b.label}</Typography>
                )
              )}
            </Breadcrumbs>
          )}
          <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>{title}</Typography>
          {subtitle && <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>{subtitle}</Typography>}
        </Box>
        {action && <Box sx={{ mt: 0.5 }}>{action}</Box>}
      </Box>
      {children}
    </Box>
  );
}
