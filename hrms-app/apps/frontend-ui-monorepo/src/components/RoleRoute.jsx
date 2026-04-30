// src/components/RoleRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import { useRole } from "@/hooks/useRole";

export function RoleRoute({
  children,
  allow = [],
  redirectTo = "/home",
}) {
  const location = useLocation();
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
      </Center>
    );
  }

  if (!allow.includes(role)) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
}

export default RoleRoute;