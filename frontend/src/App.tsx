import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './theme';
import Layout from './components/Layout';
import Login from './features/auth/Login';
import Dashboard from './features/dashboard/Dashboard';
import CustomerList from './features/customers/CustomerList';
import CustomerDetail from './features/customers/CustomerDetail';
import ProductList from './features/products/ProductList';
import ServiceList from './features/services/ServiceList';
import ServiceDue from './features/serviceDue/ServiceDue';
import Search from './features/search/Search';


function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="products" element={<ProductList />} />
        <Route path="services" element={<ServiceList />} />
        <Route path="service-due" element={<ServiceDue />} />
        <Route path="search" element={<Search />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
