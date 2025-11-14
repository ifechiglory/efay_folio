// src/App.jsx
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import Layout from "./components/layout/Layout";
import { useUIStore } from "./stores/uiStore";
import { useAuthStore } from "./stores/authStore";
import AdminPanel from "./components/admin/AdminPanel";
import LoginForm from "./components/admin/LoginForm";
import Toast from "./components/ui/Toast";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

// Public Route Component (redirect to admin if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/admin" />;
};

function App() {
  const { theme } = useUIStore();
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={theme}>
        <div className="min-h-screen overflow-hidden bg-white dark:bg-gray-900 transition-colors ">
          <Router>
            <Routes>
              {/* Public Portfolio Route */}
              <Route path="/" element={<Layout />} />

              {/* Admin Login Route */}
              <Route
                path="/admin/login"
                element={
                  <PublicRoute>
                    <LoginForm />
                  </PublicRoute>
                }
              />

              {/* Admin Dashboard Route */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route - redirect to portfolio */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
          <Toast />
        </div>
      </div>
    </QueryClientProvider>
  );
}
export default App;