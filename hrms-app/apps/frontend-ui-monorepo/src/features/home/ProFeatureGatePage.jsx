import React from "react";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import {
  Box,
  VStack,
  Text,
  Button,
  Icon,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiLock, FiChevronLeft } from "react-icons/fi";

export function ProFeatureGatePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine feature name based on path
  const isLogs = location.pathname.includes("logs");
  const featureName = isLogs ? "Activity Logs & Audit Trail" : "Employee ID & Docs Manager";

  return (
    <DashboardLayout pageTitle={featureName}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="60vh"
        px={6}
      >
        <VStack spacing={6} textAlign="center" maxW="480px">
          {/* Lock Icon Circle */}
          <Box
            p={5}
            borderRadius="full"
            bg="rgba(99, 102, 241, 0.07)"
            color="accent"
            display="flex"
            alignItems="center"
            justifyContent="center"
            shadow="inner"
          >
            <Icon as={FiLock} w={12} h={12} />
          </Box>

          <VStack spacing={2}>
            <Text fontSize="2xl" fontWeight="bold" color="text-primary">
              Pro Feature subscription gate
            </Text>
            <Text fontSize="sm" color="text-secondary" lineHeight="tall">
              The <strong>{featureName}</strong> is a premium add-on feature. Please upgrade your platform subscription plan to unlock access for your organization.
            </Text>
          </VStack>

          <Button
            bg="accent"
            color="white"
            borderRadius="xl"
            px={8}
            py={2}
            h="40px"
            fontSize="sm"
            fontWeight="bold"
            _hover={{ bg: "#5F33E1" }}
            onClick={() => navigate("/home")}
            leftIcon={<FiChevronLeft />}
          >
            Return to Dashboard
          </Button>
        </VStack>
      </Box>
    </DashboardLayout>
  );
}

export default ProFeatureGatePage;
