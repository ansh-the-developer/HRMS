import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Center, Spinner } from "@chakra-ui/react";

// ✅ Named export — for HomeRoutes.jsx: import { ProtectedRoute } from "..."
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ✅ Default export — for AppRoutes.jsx: import ProtectedRoute from "..."
export default ProtectedRoute;