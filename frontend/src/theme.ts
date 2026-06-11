import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: { 50: string; 100: string; 200: string; 300: string; 400: string; 500: string; 700: string; 900: string };
  }
  interface PaletteOptions {
    neutral?: { 50: string; 100: string; 200: string; 300: string; 400: string; 500: string; 700: string; 900: string };
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4F46E5', light: '#6366F1', dark: '#3730A3', contrastText: '#fff' },
    secondary: { main: '#0EA5E9', light: '#38BDF8', dark: '#0284C7', contrastText: '#fff' },
    success: { main: '#10B981', light: '#34D399', dark: '#059669' },
    warning: { main: '#F59E0B', light: '#FCD34D', dark: '#D97706' },
    error: { main: '#EF4444', light: '#F87171', dark: '#DC2626' },
    neutral: {
      50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1',
      400: '#94A3B8', 500: '#64748B', 700: '#334155', 900: '#0F172A',
    },
    background: { default: '#F0F4FA', paper: '#FFFFFF' },
    text: { primary: '#0F172A', secondary: '#64748B' },
    divider: '#E2E8F0',
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.015em' },
    h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4, letterSpacing: '-0.01em' },
    h5: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.57 },
    caption: { fontSize: '0.75rem', lineHeight: 1.5, letterSpacing: '0.01em' },
    subtitle1: { fontSize: '0.9375rem', fontWeight: 500, lineHeight: 1.57 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.57 },
    button: { fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.01em', textTransform: 'none' },
  },
  shape: { borderRadius: 10 },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.05)',
    '0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    '0 2px 8px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
    '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
    '0 6px 16px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.04)',
    '0 8px 24px rgba(0,0,0,0.1), 0 3px 8px rgba(0,0,0,0.05)',
    '0 10px 28px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)',
    '0 12px 32px rgba(0,0,0,0.11), 0 4px 12px rgba(0,0,0,0.05)',
    '0 14px 36px rgba(0,0,0,0.12), 0 5px 14px rgba(0,0,0,0.06)',
    '0 16px 40px rgba(0,0,0,0.12), 0 6px 16px rgba(0,0,0,0.06)',
    '0 18px 44px rgba(0,0,0,0.13)', '0 20px 48px rgba(0,0,0,0.13)',
    '0 22px 52px rgba(0,0,0,0.14)', '0 24px 56px rgba(0,0,0,0.14)',
    '0 26px 60px rgba(0,0,0,0.15)', '0 28px 64px rgba(0,0,0,0.15)',
    '0 30px 68px rgba(0,0,0,0.16)', '0 32px 72px rgba(0,0,0,0.16)',
    '0 34px 76px rgba(0,0,0,0.17)', '0 36px 80px rgba(0,0,0,0.17)',
    '0 38px 84px rgba(0,0,0,0.18)', '0 40px 88px rgba(0,0,0,0.18)',
    '0 42px 92px rgba(0,0,0,0.19)', '0 44px 96px rgba(0,0,0,0.2)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box', margin: 0, padding: 0 },
        html: { scrollBehavior: 'smooth' },
        body: { fontFamily: '"Inter", sans-serif', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        '::-webkit-scrollbar': { width: '6px', height: '6px' },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': { background: '#CBD5E1', borderRadius: '3px' },
        '::-webkit-scrollbar-thumb:hover': { background: '#94A3B8' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '8px 16px',
          transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': { transform: 'translateY(-1px)' },
          '&:active': { transform: 'translateY(0)' },
        },
        contained: {
          boxShadow: '0 1px 3px rgba(79,70,229,0.3)',
          '&:hover': { boxShadow: '0 4px 12px rgba(79,70,229,0.35)' },
        },
        outlined: { borderWidth: '1.5px', '&:hover': { borderWidth: '1.5px' } },
        sizeSmall: { padding: '5px 12px', fontSize: '0.8125rem' },
        sizeLarge: { padding: '11px 24px', fontSize: '0.9375rem' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.25s ease, transform 0.25s ease',
          '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.09)', transform: 'translateY(-1px)' },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: { root: { padding: '20px 24px', '&:last-child': { paddingBottom: '20px' } } },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 14 },
        elevation1: { boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: { borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#F8FAFC',
            color: '#475569',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            borderBottom: '1px solid #E2E8F0',
            padding: '12px 16px',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            transition: 'background-color 0.15s ease',
            '&:hover': { backgroundColor: alpha('#4F46E5', 0.03) },
            '&:last-child .MuiTableCell-body': { borderBottom: 'none' },
          },
          '& .MuiTableCell-body': {
            padding: '13px 16px',
            color: '#1E293B',
            fontSize: '0.875rem',
            borderBottom: '1px solid #F1F5F9',
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: { root: { borderTop: '1px solid #E2E8F0', color: '#64748B' } },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            transition: 'box-shadow 0.2s ease',
            '& fieldset': { borderColor: '#E2E8F0', borderWidth: '1.5px' },
            '&:hover fieldset': { borderColor: '#CBD5E1' },
            '&.Mui-focused fieldset': { borderColor: '#4F46E5', borderWidth: '2px' },
            '&.Mui-focused': { boxShadow: `0 0 0 3px ${alpha('#4F46E5', 0.1)}` },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#4F46E5' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: { borderRadius: 8 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500, fontSize: '0.75rem' },
        colorSuccess: { backgroundColor: '#DCFCE7', color: '#166534' },
        colorError: { backgroundColor: '#FEE2E2', color: '#991B1B' },
        colorWarning: { backgroundColor: '#FEF3C7', color: '#92400E' },
        colorPrimary: { backgroundColor: '#EEF2FF', color: '#3730A3' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16, border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { padding: '20px 24px 8px', fontSize: '1.125rem', fontWeight: 600, color: '#0F172A' },
      },
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: '16px 24px' } },
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: '16px 24px', borderTop: '1px solid #F1F5F9' } },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, fontSize: '0.875rem' },
        standardError: { backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' },
        standardInfo: { backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF' },
        standardSuccess: { backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534' },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: { root: { backgroundColor: '#F1F5F9', borderRadius: 8, padding: '3px', gap: '2px' } },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: '6px !important',
          padding: '5px 14px',
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: '#64748B',
          transition: 'all 0.2s ease',
          '&.Mui-selected': { backgroundColor: '#FFFFFF', color: '#4F46E5', fontWeight: 600, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
          '&:hover': { backgroundColor: alpha('#4F46E5', 0.05) },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease',
            '&.Mui-selected': { backgroundColor: '#4F46E5', color: '#fff', fontWeight: 600 },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: { borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #E2E8F0' },
        option: { borderRadius: 6, margin: '2px 4px', fontSize: '0.875rem', '&:hover': { backgroundColor: '#F1F5F9' } },
      },
    },
    MuiSkeleton: {
      styleOverrides: { root: { borderRadius: 8, transform: 'none' } },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 4, backgroundColor: '#E2E8F0' } },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: '#E2E8F0' } },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.15s ease',
          '&:hover': { backgroundColor: alpha('#FFFFFF', 0.08) },
          '&.Mui-selected': {
            backgroundColor: alpha('#FFFFFF', 0.12),
            '&:hover': { backgroundColor: alpha('#FFFFFF', 0.16) },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: '#1E293B', fontSize: '0.75rem', borderRadius: 6, padding: '6px 10px' },
        arrow: { color: '#1E293B' },
      },
    },
  },
});

export default theme;
